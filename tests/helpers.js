/**
 * Test helper utilities
 */

/**
 * Creates a mock Express request object
 * @param {Object} options - Request options
 * @returns {Object} Mock request object
 */
const createMockReq = (options = {}) => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    user: options.user || null,
    ...options
  };
};

/**
 * Creates a mock Express response object
 * @returns {Object} Mock response object with jest spies
 */
const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Creates a mock Next function
 * @returns {Function} Mock next function
 */
const createMockNext = () => jest.fn();

/**
 * Generates mock user data
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock user data
 */
const createMockUser = (overrides = {}) => {
  return {
    _id: 'mockUserId123',
    nom: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'client',
    statut: true,
    badges: [],
    score: 0,
    ...overrides
  };
};

/**
 * Generates mock TypesExercice data
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock TypesExercice data
 */
const createMockTypesExercice = (overrides = {}) => {
  return {
    _id: 'mockTypeId123',
    nom: 'Test Exercise',
    description: 'Test description',
    muscles: ['chest', 'triceps'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Generates a mock JWT token
 * @param {Object} payload - Token payload
 * @returns {string} Mock JWT token
 */
const createMockToken = (payload = {}) => {
  return 'mock.jwt.token';
};

/**
 * Generates mock error objects
 * @param {string} message - Error message
 * @param {string} name - Error name
 * @returns {Error} Mock error object
 */
const createMockError = (message = 'Test error', name = 'Error') => {
  const error = new Error(message);
  error.name = name;
  return error;
};

/**
 * Validates that a mock function was called with specific arguments
 * @param {Function} mockFn - Jest mock function
 * @param {Array} expectedArgs - Expected arguments
 */
const expectCalledWith = (mockFn, expectedArgs) => {
  expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
};

/**
 * Validates response structure for successful operations
 * @param {Object} mockRes - Mock response object
 * @param {number} statusCode - Expected status code
 * @param {Object} data - Expected response data
 */
const expectSuccessResponse = (mockRes, statusCode, data) => {
  expect(mockRes.status).toHaveBeenCalledWith(statusCode);
  expect(mockRes.json).toHaveBeenCalledWith(data);
};

/**
 * Validates response structure for error operations
 * @param {Object} mockRes - Mock response object
 * @param {number} statusCode - Expected status code
 * @param {string} message - Expected error message
 */
const expectErrorResponse = (mockRes, statusCode, message) => {
  expect(mockRes.status).toHaveBeenCalledWith(statusCode);
  expect(mockRes.json).toHaveBeenCalledWith({ message });
};

module.exports = {
  createMockReq,
  createMockRes,
  createMockNext,
  createMockUser,
  createMockTypesExercice,
  createMockToken,
  createMockError,
  expectCalledWith,
  expectSuccessResponse,
  expectErrorResponse
};
