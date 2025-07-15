const request = require('supertest');
const mongoose = require('mongoose');
const { app, createTestUser } = require('./helpers');
const Salle = require('../models/salle');

describe('SallesProprietaire API', () => {
  let proprietaireUser, proprietaireToken, clientUser, clientToken;

  beforeAll(async () => {
    // Créer un utilisateur propriétaire et un client pour les tests
    const proprietaireData = await createTestUser('proprietaire_salle');
    proprietaireUser = proprietaireData.user;
    proprietaireToken = proprietaireData.token;

    const clientData = await createTestUser('client');
    clientUser = clientData.user;
    clientToken = clientData.token;
  });

  describe('POST /api/v1/proprietaire/salles/demande', () => {
    it('should create a new salle request when authenticated as proprietaire', async () => {
      const salleData = {
        nom: 'Ma Nouvelle Salle',
        adresse: '123 Rue du Test',
        ville: 'Testville',
        code_postal: '75000',
        pays: 'France',
        capacite: 50,
        equipements: ['Tapis', 'Haltères', 'Bancs']
      };

      const response = await request(app)
        .post('/api/v1/proprietaire/salles/demande')
        .set('Authorization', `Bearer ${proprietaireToken}`)
        .send(salleData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.nom).toBe(salleData.nom);
      expect(response.body.proprietaire_id.toString()).toBe(proprietaireUser._id.toString());
      expect(response.body.statut).toBe('en_attente');
    });

    it('should not allow client to create a salle request', async () => {
      const salleData = {
        nom: 'Salle Interdite',
        adresse: '123 Rue du Test',
        ville: 'Testville',
        code_postal: '75000',
        pays: 'France',
        capacite: 50,
        equipements: ['Tapis', 'Haltères', 'Bancs']
      };

      const response = await request(app)
        .post('/api/v1/proprietaire/salles/demande')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(salleData);

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/v1/proprietaire/salles/mienne', () => {
    beforeEach(async () => {
      // Créer des salles pour le propriétaire
      await Salle.create({
        nom: 'Salle Test 1',
        adresse: '123 Rue du Test',
        ville: 'Testville',
        code_postal: '75000',
        pays: 'France',
        capacite: 50,
        proprietaire_id: proprietaireUser._id,
        statut: 'en_attente',
        equipements: ['Tapis', 'Haltères']
      });

      await Salle.create({
        nom: 'Salle Test 2',
        adresse: '456 Avenue du Test',
        ville: 'Testville',
        code_postal: '75000',
        pays: 'France',
        capacite: 100,
        proprietaire_id: proprietaireUser._id,
        statut: 'approuve',
        equipements: ['Vélos', 'Rameurs']
      });

      // Créer une salle pour un autre propriétaire
      const anotherProprietaire = await createTestUser('proprietaire_salle');
      await Salle.create({
        nom: 'Salle Autre',
        adresse: '789 Boulevard du Test',
        ville: 'Autreville',
        code_postal: '69000',
        pays: 'France',
        capacite: 75,
        proprietaire_id: anotherProprietaire.user._id,
        statut: 'approuve',
        equipements: ['Bancs', 'Poids']
      });
    });

    it('should list only salles owned by the authenticated proprietaire', async () => {
      const response = await request(app)
        .get('/api/v1/proprietaire/salles/mienne')
        .set('Authorization', `Bearer ${proprietaireToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      
      // Vérifier que toutes les salles appartiennent au propriétaire connecté
      response.body.forEach(salle => {
        expect(salle.proprietaire_id.toString()).toBe(proprietaireUser._id.toString());
      });
    });
  });

  describe('PUT /api/v1/proprietaire/salles/mienne', () => {
    let salleId;

    beforeEach(async () => {
      // Créer une salle pour le propriétaire
      const salle = await Salle.create({
        nom: 'Salle à modifier',
        adresse: '123 Rue du Test',
        ville: 'Testville',
        code_postal: '75000',
        pays: 'France',
        capacite: 50,
        proprietaire_id: proprietaireUser._id,
        statut: 'en_attente',
        equipements: ['Tapis', 'Haltères']
      });
      salleId = salle._id;
    });

    it('should update a salle owned by the authenticated proprietaire', async () => {
      const updateData = {
        id: salleId,
        nom: 'Salle Mise à Jour',
        capacite: 75,
        equipements: ['Tapis', 'Haltères', 'Bancs']
      };

      const response = await request(app)
        .put('/api/v1/proprietaire/salles/mienne')
        .set('Authorization', `Bearer ${proprietaireToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.nom).toBe(updateData.nom);
      expect(response.body.capacite).toBe(updateData.capacite);
      expect(response.body.equipements).toEqual(expect.arrayContaining(updateData.equipements));
    });
  });
});
