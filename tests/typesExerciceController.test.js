const TypesExercice = require('../models/typesExercice');
const {
  createTypesExercice,
  listTypesExercices,
  updateTypesExercice,
  deleteTypesExercice
} = require('../controllers/typesExerciceController');

// Mock the TypesExercice model
jest.mock('../models/typesExercice');

describe('TypesExerciceController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('createTypesExercice', () => {
    const mockTypesExerciceData = {
      nom: 'Push-ups',
      description: 'Upper body exercise',
      muscles: ['chest', 'triceps', 'shoulders']
    };

    beforeEach(() => {
      mockReq.body = mockTypesExerciceData;
    });

    it('should create a new TypesExercice successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue();
      
      // Mock the constructor to return an instance with save method
      const mockInstance = {
        save: mockSave,
        _id: 'typeId123',
        ...mockTypesExerciceData
      };
      TypesExercice.mockImplementation(() => mockInstance);

      await createTypesExercice(mockReq, mockRes);

      expect(TypesExercice).toHaveBeenCalledWith(mockTypesExerciceData);
      expect(mockSave).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockInstance);
    });

    it('should handle database save error', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Database save failed'));
      
      TypesExercice.mockImplementation(() => ({
        save: mockSave
      }));

      await createTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database save failed' });
    });

    it('should handle validation error', async () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        nom: { message: 'Name is required' }
      };

      const mockSave = jest.fn().mockRejectedValue(validationError);
      
      TypesExercice.mockImplementation(() => ({
        save: mockSave
      }));

      await createTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Validation failed' });
    });

    it('should create TypesExercice with minimal data', async () => {
      mockReq.body = { nom: 'Basic Exercise' };
      const mockSave = jest.fn().mockResolvedValue();
      
      const mockInstance = {
        save: mockSave,
        _id: 'typeId124',
        nom: 'Basic Exercise'
      };
      TypesExercice.mockImplementation(() => mockInstance);

      await createTypesExercice(mockReq, mockRes);

      expect(TypesExercice).toHaveBeenCalledWith({ nom: 'Basic Exercise' });
      expect(mockSave).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockInstance);
    });

    it('should handle empty request body', async () => {
      mockReq.body = {};
      const mockSave = jest.fn().mockRejectedValue(new Error('Name is required'));
      
      TypesExercice.mockImplementation(() => ({
        save: mockSave
      }));

      await createTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name is required' });
    });
  });

  describe('listTypesExercices', () => {
    it('should return list of all TypesExercices', async () => {
      const mockTypesExercices = [
        { _id: 'type1', nom: 'Push-ups', description: 'Upper body' },
        { _id: 'type2', nom: 'Pull-ups', description: 'Back exercise' }
      ];

      TypesExercice.find = jest.fn().mockResolvedValue(mockTypesExercices);

      await listTypesExercices(mockReq, mockRes);

      expect(TypesExercice.find).toHaveBeenCalledWith();
      expect(mockRes.json).toHaveBeenCalledWith(mockTypesExercices);
    });

    it('should return empty array when no TypesExercices exist', async () => {
      TypesExercice.find = jest.fn().mockResolvedValue([]);

      await listTypesExercices(mockReq, mockRes);

      expect(TypesExercice.find).toHaveBeenCalledWith();
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should handle database error', async () => {
      TypesExercice.find = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      await listTypesExercices(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database connection failed' });
    });

    it('should handle null response from database', async () => {
      TypesExercice.find = jest.fn().mockResolvedValue(null);

      await listTypesExercices(mockReq, mockRes);

      expect(TypesExercice.find).toHaveBeenCalledWith();
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it('should handle database timeout error', async () => {
      const timeoutError = new Error('Database timeout');
      timeoutError.code = 'ETIMEDOUT';
      
      TypesExercice.find = jest.fn().mockRejectedValue(timeoutError);

      await listTypesExercices(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database timeout' });
    });
  });

  describe('updateTypesExercice', () => {
    const mockUpdateData = {
      nom: 'Updated Push-ups',
      description: 'Updated description',
      muscles: ['chest', 'triceps']
    };

    beforeEach(() => {
      mockReq.params.id = 'typeId123';
      mockReq.body = mockUpdateData;
    });

    it('should update TypesExercice successfully', async () => {
      const mockUpdatedTypesExercice = { _id: 'typeId123', ...mockUpdateData };
      
      TypesExercice.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedTypesExercice);

      await updateTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndUpdate).toHaveBeenCalledWith(
        'typeId123',
        mockUpdateData,
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTypesExercice);
    });

    it('should return 404 when TypesExercice not found', async () => {
      TypesExercice.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndUpdate).toHaveBeenCalledWith(
        'typeId123',
        mockUpdateData,
        { new: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'TypesExercice not found' });
    });

    it('should handle invalid ObjectId', async () => {
      mockReq.params.id = 'invalidId';
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      
      TypesExercice.findByIdAndUpdate = jest.fn().mockRejectedValue(castError);

      await updateTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cast to ObjectId failed' });
    });

    it('should handle database error during update', async () => {
      TypesExercice.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database update failed'));

      await updateTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database update failed' });
    });

    it('should handle validation error during update', async () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      
      TypesExercice.findByIdAndUpdate = jest.fn().mockRejectedValue(validationError);

      await updateTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Validation failed' });
    });

    it('should update with partial data', async () => {
      mockReq.body = { nom: 'Partial Update' };
      const mockUpdatedTypesExercice = { _id: 'typeId123', nom: 'Partial Update' };
      
      TypesExercice.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedTypesExercice);

      await updateTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndUpdate).toHaveBeenCalledWith(
        'typeId123',
        { nom: 'Partial Update' },
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTypesExercice);
    });

    it('should handle empty update data', async () => {
      mockReq.body = {};
      const mockUpdatedTypesExercice = { _id: 'typeId123', nom: 'Original Name' };
      
      TypesExercice.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedTypesExercice);

      await updateTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndUpdate).toHaveBeenCalledWith(
        'typeId123',
        {},
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTypesExercice);
    });
  });

  describe('deleteTypesExercice', () => {
    beforeEach(() => {
      mockReq.params.id = 'typeId123';
    });

    it('should delete TypesExercice successfully', async () => {
      const mockDeletedTypesExercice = { _id: 'typeId123', nom: 'Deleted Exercise' };
      
      TypesExercice.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedTypesExercice);

      await deleteTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndDelete).toHaveBeenCalledWith('typeId123');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'TypesExercice deleted' });
    });

    it('should return 404 when TypesExercice not found', async () => {
      TypesExercice.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteTypesExercice(mockReq, mockRes);

      expect(TypesExercice.findByIdAndDelete).toHaveBeenCalledWith('typeId123');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'TypesExercice not found' });
    });

    it('should handle invalid ObjectId during delete', async () => {
      mockReq.params.id = 'invalidId';
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      
      TypesExercice.findByIdAndDelete = jest.fn().mockRejectedValue(castError);

      await deleteTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cast to ObjectId failed' });
    });

    it('should handle database error during delete', async () => {
      TypesExercice.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database delete failed'));

      await deleteTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database delete failed' });
    });

    it('should handle missing id parameter', async () => {
      mockReq.params.id = undefined;
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      
      TypesExercice.findByIdAndDelete = jest.fn().mockRejectedValue(castError);

      await deleteTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cast to ObjectId failed' });
    });

    it('should handle null id parameter', async () => {
      mockReq.params.id = null;
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      
      TypesExercice.findByIdAndDelete = jest.fn().mockRejectedValue(castError);

      await deleteTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cast to ObjectId failed' });
    });

    it('should handle empty string id parameter', async () => {
      mockReq.params.id = '';
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      
      TypesExercice.findByIdAndDelete = jest.fn().mockRejectedValue(castError);

      await deleteTypesExercice(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cast to ObjectId failed' });
    });
  });
});
