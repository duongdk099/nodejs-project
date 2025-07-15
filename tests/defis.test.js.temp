const request = require('supertest');
const mongoose = require('mongoose');
const { app, createTestUser } = require('./helpers');
const Defi = require('../models/defi');
const Salle = require('../models/salle');

describe('Defis API', () => {
  let clientUser, clientToken, adminUser, adminToken, salleId;

  beforeAll(async () => {
    // Créer un utilisateur client et un admin pour les tests
    const clientData = await createTestUser('client');
    clientUser = clientData.user;
    clientToken = clientData.token;

    const adminData = await createTestUser('super_admin');
    adminUser = adminData.user;
    adminToken = adminData.token;

    // Créer une salle pour les tests
    const salle = await Salle.create({
      nom: 'Salle Test',
      capacite: 50,
      proprietaire_id: adminUser._id,
      statut: 'approuve',
      adresse: '123 Test St'
    });
    salleId = salle._id;
  });

  describe('POST /api/v1/defis', () => {
    it('should create a new defi when authenticated as client', async () => {
      const defiData = {
        titre: 'Test Defi',
        objectifs: ['Perdre du poids', 'Tonifier les muscles'],
        exercices: [new mongoose.Types.ObjectId().toString()],
        duree: 14,
        difficulte: 'Moyen',
        salle_id: salleId.toString(),
        score_bonus: 100
      };

      const response = await request(app)
        .post('/api/v1/defis')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(defiData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.titre).toBe(defiData.titre);
      expect(response.body.createur_id.toString()).toBe(clientUser._id.toString());
      expect(response.body.statut).toBe('propose');
    });

    it('should not allow admin to create a defi', async () => {
      const defiData = {
        titre: 'Admin Defi',
        objectifs: ['Test'],
        exercices: [new mongoose.Types.ObjectId().toString()],
        duree: 7,
        difficulte: 'Difficile',
        salle_id: salleId.toString(),
        score_bonus: 50
      };

      const response = await request(app)
        .post('/api/v1/defis')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(defiData);

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/v1/defis', () => {
    beforeEach(async () => {
      // Créer quelques défis pour les tests
      await Defi.create({
        titre: 'Defi 1',
        objectifs: ['Test 1'],
        exercices: [new mongoose.Types.ObjectId()],
        duree: 7,
        difficulte: 'Facile',
        createur_id: clientUser._id,
        salle_id: salleId,
        statut: 'propose'
      });

      await Defi.create({
        titre: 'Defi 2',
        objectifs: ['Test 2'],
        exercices: [new mongoose.Types.ObjectId()],
        duree: 14,
        difficulte: 'Moyen',
        createur_id: clientUser._id,
        salle_id: salleId,
        statut: 'approuve'
      });
    });

    it('should list all defis for client', async () => {
      const response = await request(app)
        .get('/api/v1/defis')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PUT /api/v1/defis/:id/approuver', () => {
    let defiId;

    beforeEach(async () => {
      // Créer un défi pour les tests
      const defi = await Defi.create({
        titre: 'Defi à approuver',
        objectifs: ['Test'],
        exercices: [new mongoose.Types.ObjectId()],
        duree: 7,
        difficulte: 'Facile',
        createur_id: clientUser._id,
        salle_id: salleId,
        statut: 'propose'
      });
      defiId = defi._id;
    });

    it('should allow admin to approve a defi', async () => {
      const response = await request(app)
        .put(`/api/v1/defis/${defiId}/approuver`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.statut).toBe('approuve');
    });

    it('should not allow client to approve a defi', async () => {
      const response = await request(app)
        .put(`/api/v1/defis/${defiId}/approuver`)
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/v1/defis/:id', () => {
    let defiId;

    beforeEach(async () => {
      // Créer un défi pour les tests
      const defi = await Defi.create({
        titre: 'Defi à supprimer',
        objectifs: ['Test'],
        exercices: [new mongoose.Types.ObjectId()],
        duree: 7,
        difficulte: 'Facile',
        createur_id: clientUser._id,
        salle_id: salleId,
        statut: 'propose'
      });
      defiId = defi._id;
    });

    it('should allow admin to delete a defi', async () => {
      const response = await request(app)
        .delete(`/api/v1/defis/${defiId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      
      // Vérifier que le défi a été supprimé
      const defiExists = await Defi.findById(defiId);
      expect(defiExists).toBeNull();
    });

    it('should not allow client to delete a defi', async () => {
      const response = await request(app)
        .delete(`/api/v1/defis/${defiId}`)
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.statusCode).toBe(403);
      
      // Vérifier que le défi existe toujours
      const defiExists = await Defi.findById(defiId);
      expect(defiExists).not.toBeNull();
    });
  });
});
