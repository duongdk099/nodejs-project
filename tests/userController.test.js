const { 
  listUsers, 
  deactivateUser, 
  deleteUser, 
  setRole 
} = require('../controllers/userController');
const User = require('../models/user');

// Mock the User model
jest.mock('../models/user');

describe('UserController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { _id: '1', nom: 'User 1', email: 'user1@test.com', role: 'client' },
        { _id: '2', nom: 'User 2', email: 'user2@test.com', role: 'proprietaire_salle' }
      ];

      User.find = jest.fn().mockResolvedValue(mockUsers);

      await listUsers(mockReq, mockRes);

      expect(User.find).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database connection failed';
      User.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deactivateUser', () => {
    beforeEach(() => {
      mockReq.params.id = 'user123';
    });

    it('should deactivate user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        nom: 'Test User',
        email: 'test@test.com',
        statut: false
      };

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

      await deactivateUser(mockReq, mockRes);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { statut: false },
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await deactivateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database error';
      User.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

      await deactivateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      mockReq.params.id = 'user123';
    });

    it('should delete user successfully', async () => {
      const mockDeletedUser = { _id: 'user123', nom: 'Test User' };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedUser);

      await deleteUser(mockReq, mockRes);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User deleted' });
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database error';
      User.findByIdAndDelete = jest.fn().mockRejectedValue(new Error(errorMessage));

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('setRole', () => {
    beforeEach(() => {
      mockReq.params.id = 'user123';
      mockReq.user.id = 'admin456';
      mockReq.body.role = 'proprietaire_salle';
    });

    it('should set user role successfully', async () => {
      const mockUpdatedUser = {
        _id: 'user123',
        nom: 'Test User',
        email: 'test@test.com',
        role: 'proprietaire_salle',
        statut: true
      };

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      });

      await setRole(mockReq, mockRes);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { role: 'proprietaire_salle' },
        { new: true, runValidators: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User role updated successfully',
        user: {
          id: 'user123',
          nom: 'Test User',
          email: 'test@test.com',
          role: 'proprietaire_salle',
          statut: true
        }
      });
    });

    it('should return 400 for invalid role', async () => {
      mockReq.body.role = 'invalid_role';

      await setRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid role. Must be one of: super_admin, proprietaire_salle, client'
      });
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should return 400 for missing role', async () => {
      mockReq.body = {};

      await setRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid role. Must be one of: super_admin, proprietaire_salle, client'
      });
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should prevent admin from changing their own role', async () => {
      mockReq.params.id = 'admin456'; // Same as req.user.id
      mockReq.user.id = 'admin456';

      await setRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cannot change your own role'
      });
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await setRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle each valid role', async () => {
      const validRoles = ['super_admin', 'proprietaire_salle', 'client'];
      
      for (const role of validRoles) {
        jest.clearAllMocks();
        mockReq.body.role = role;
        
        const mockUser = {
          _id: 'user123',
          nom: 'Test User',
          email: 'test@test.com',
          role: role,
          statut: true
        };

        User.findByIdAndUpdate = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockUser)
        });

        await setRole(mockReq, mockRes);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          'user123',
          { role: role },
          { new: true, runValidators: true }
        );
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'User role updated successfully',
          user: {
            id: 'user123',
            nom: 'Test User',
            email: 'test@test.com',
            role: role,
            statut: true
          }
        });
      }
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database error';
      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error(errorMessage))
      });

      await setRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should exclude password from response', async () => {
      const mockUser = {
        _id: 'user123',
        nom: 'Test User',
        email: 'test@test.com',
        role: 'proprietaire_salle',
        statut: true
      };

      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: mockSelect
      });

      await setRole(mockReq, mockRes);

      expect(mockSelect).toHaveBeenCalledWith('-password');
    });
  });
});
