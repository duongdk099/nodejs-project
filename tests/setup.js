const mongoose = require('mongoose');
require('dotenv').config();

// Augmenter le délai pour permettre aux opérations de se terminer
jest.setTimeout(10000);

// Avant tous les tests
beforeAll(async () => {
  // Connexion à la base de données de test
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Après tous les tests
afterAll(async () => {
  // Fermer la connexion à la base de données
  await mongoose.connection.close();
});

// Après chaque test
afterEach(async () => {
  // Nettoyer la base de données si nécessaire
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
