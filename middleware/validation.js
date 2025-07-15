const Joi = require('joi');

// Middleware de validation avec Joi
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map(detail => detail.message).join(', ')
      });
    }
    next();
  };
};

// Schémas de validation
const schemas = {
  // Schéma de validation pour l'authentification
  auth: {
    register: Joi.object({
      nom: Joi.string().required(),
      prenom: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('client', 'proprietaire_salle', 'super_admin').default('client')
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  },
  
  // Schéma de validation pour les défis
  defi: {
    create: Joi.object({
      nom: Joi.string().required(),
      description: Joi.string().required(),
      niveau_difficulte: Joi.string().valid('Facile', 'Moyen', 'Difficile').required(),
      duree_jours: Joi.number().integer().min(1).required(),
      types_exercices: Joi.array().items(Joi.string()).min(1).required()
    }),
    update: Joi.object({
      nom: Joi.string(),
      description: Joi.string(),
      niveau_difficulte: Joi.string().valid('Facile', 'Moyen', 'Difficile'),
      duree_jours: Joi.number().integer().min(1),
      types_exercices: Joi.array().items(Joi.string()).min(1)
    })
  },
  
  // Schéma de validation pour les salles
  salle: {
    create: Joi.object({
      nom: Joi.string().required(),
      adresse: Joi.string().required(),
      ville: Joi.string().required(),
      code_postal: Joi.string().required(),
      pays: Joi.string().required(),
      capacite: Joi.number().integer().positive().required(),
      equipements: Joi.array().items(Joi.string()).default([])
    }),
    update: Joi.object({
      id: Joi.string().required(),
      nom: Joi.string(),
      adresse: Joi.string(),
      ville: Joi.string(),
      code_postal: Joi.string(),
      pays: Joi.string(),
      capacite: Joi.number().integer().positive(),
      equipements: Joi.array().items(Joi.string())
    })
  },
  
  // Schéma de validation pour les types d'exercice
  typesExercice: {
    create: Joi.object({
      nom: Joi.string().required(),
      description: Joi.string().required(),
      muscle_cible: Joi.array().items(Joi.string()).min(1).required(),
      difficulte: Joi.string().valid('Facile', 'Moyen', 'Difficile').required(),
      equipement_requis: Joi.array().items(Joi.string()).default(['Aucun'])
    }),
    update: Joi.object({
      nom: Joi.string(),
      description: Joi.string(),
      muscle_cible: Joi.array().items(Joi.string()).min(1),
      difficulte: Joi.string().valid('Facile', 'Moyen', 'Difficile'),
      equipement_requis: Joi.array().items(Joi.string())
    })
  }
};

module.exports = {
  validate,
  schemas
};
