const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { register, login, protectedRoute } = require('../controllers/authController');

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/user');

describe('AuthController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockUserData = {
      nom: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client'
    };

    beforeEach(() => {
      mockReq.body = mockUserData;
    });

    it('should register a new user successfully', async () => {
      // Mock dependencies
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockSave = jest.fn().mockResolvedValue();
      User.mockImplementation(() => ({
        save: mockSave,
        ...mockUserData,
        password: 'hashedPassword'
      }));

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 'salt');
      expect(User).toHaveBeenCalledWith({
        nom: mockUserData.nom,
        email: mockUserData.email,
        password: 'hashedPassword',
        role: mockUserData.role
      });
      expect(mockSave).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registered' });
    });

    it('should return error if email already exists', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: mockUserData.email });

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });

    it('should handle bcrypt.genSalt error', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt.mockRejectedValue(new Error('Salt generation failed'));

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Salt generation failed' });
    });

    it('should handle bcrypt.hash error', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockRejectedValue(new Error('Hash generation failed'));

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Hash generation failed' });
    });

    it('should handle database save error', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockSave = jest.fn().mockRejectedValue(new Error('Database save failed'));
      User.mockImplementation(() => ({
        save: mockSave
      }));

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database save failed' });
    });

    it('should handle User.findOne database error', async () => {
      User.findOne = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database connection failed' });
    });

    it('should create user with default role when role not provided', async () => {
      const userDataWithoutRole = { ...mockUserData };
      delete userDataWithoutRole.role;
      mockReq.body = userDataWithoutRole;

      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockSave = jest.fn().mockResolvedValue();
      User.mockImplementation(() => ({
        save: mockSave
      }));

      await register(mockReq, mockRes);

      expect(User).toHaveBeenCalledWith({
        nom: userDataWithoutRole.nom,
        email: userDataWithoutRole.email,
        password: 'hashedPassword',
        role: undefined
      });
      expect(mockSave).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      _id: 'userId123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'client'
    };

    beforeEach(() => {
      mockReq.body = mockLoginData;
      process.env.JWT_SECRET = 'test-jwt-secret';
    });

    it('should login successfully with valid credentials', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return error if user not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return error if password does not match', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockUser.password);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle database error during user lookup', async () => {
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

    it('should handle bcrypt.compare error', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bcrypt error' });
    });

    it('should handle JWT signing error', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'JWT signing failed' });
    });

    it('should handle missing email in request', async () => {
      mockReq.body = { password: 'password123' };

      User.findOne = jest.fn().mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: undefined });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle missing password in request', async () => {
      mockReq.body = { email: 'test@example.com' };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith(undefined, mockUser.password);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('protectedRoute', () => {
    it('should return super admin content', async () => {
      await protectedRoute(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Super admin content' });
    });

    it('should handle any unexpected errors', async () => {
      // Mock res.json to throw an error
      mockRes.json = jest.fn().mockImplementation(() => {
        throw new Error('Response error');
      });

      try {
        await protectedRoute(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('Response error');
      }
    });
  });
});
