import Joi from 'joi';

export const createTrajetSchema = Joi.object({
    pointDepart: Joi.string().trim().required().messages({
        'string.empty': 'Le point de départ est requis',
        'any.required': 'Le point de départ est requis',
    }),
    pointArrivee: Joi.string().trim().required().messages({
        'string.empty': 'Le point d\'arrivée est requis',
        'any.required': 'Le point d\'arrivée est requis',
    }),
    dateDepart: Joi.date().required().messages({
        'date.base': 'La date de départ doit être une date valide',
        'any.required': 'La date de départ est requise',
    }),
    kmDepart: Joi.number().min(0).required().messages({
        'number.base': 'Le kilométrage de départ doit être un nombre',
        'number.min': 'Le kilométrage ne peut pas être négatif',
        'any.required': 'Le kilométrage de départ est requis',
    }),
    chauffeurId: Joi.string().required().messages({
        'string.empty': 'Le chauffeur est requis',
        'any.required': 'Le chauffeur est requis',
    }),
    camionId: Joi.string().required().messages({
        'string.empty': 'Le camion est requis',
        'any.required': 'Le camion est requis',
    }),
    remorqueId: Joi.string().allow(null, '').optional(),
    remarques: Joi.string().trim().allow('').optional(),
});

export const updateTrajetSchema = Joi.object({
    pointDepart: Joi.string().trim().optional(),
    pointArrivee: Joi.string().trim().optional(),
    dateDepart: Joi.date().optional(),
    dateArrivee: Joi.date().optional(),
    kmDepart: Joi.number().min(0).optional(),
    kmArrivee: Joi.number().min(0).optional(),
    volumeGasoil: Joi.number().min(0).optional(),
    statut: Joi.string().valid('a_faire', 'en_cours', 'termine').optional(),
    chauffeurId: Joi.string().optional(),
    camionId: Joi.string().optional(),
    remorqueId: Joi.string().allow(null, '').optional(),
    remarques: Joi.string().trim().allow('').optional(),
});

export const updateStatutSchema = Joi.object({
    statut: Joi.string().valid('a_faire', 'en_cours', 'termine').required().messages({
        'any.only': 'Le statut doit être: a_faire, en_cours ou termine',
        'any.required': 'Le statut est requis',
    }),
    kmArrivee: Joi.when('statut', {
        is: 'termine',
        then: Joi.number().min(0).required().messages({
            'any.required': 'Le kilométrage d\'arrivée est requis pour terminer le trajet',
        }),
        otherwise: Joi.number().min(0).optional(),
    }),
    volumeGasoil: Joi.number().min(0).optional(),
    dateArrivee: Joi.date().optional(),
    remarques: Joi.string().trim().allow('').optional(),
});

export const createRegleMaintenanceSchema = Joi.object({
    typeEntretien: Joi.string()
        .valid('vidange', 'pneus', 'revision', 'freins', 'technique', 'autre')
        .required()
        .messages({
            'any.only': 'Type invalide (vidange, pneus, revision, freins, technique, autre)',
            'any.required': "Le type d'entretien est requis",
        }),
    categorieVehicule: Joi.string().valid('Camion', 'Remorque').required(),
    intervalleKm: Joi.number().min(0).allow(null).optional(),
    intervalleTempsMois: Joi.number().min(0).allow(null).optional(),
    seuilAlerteKm: Joi.number().min(0).default(1000),
    seuilAlerteMois: Joi.number().min(0).default(1),
    description: Joi.string().allow('').optional(),
}).or('intervalleKm', 'intervalleTempsMois');

export const updateRegleMaintenanceSchema = Joi.object({
    typeEntretien: Joi.string().valid('vidange', 'pneus', 'revision', 'freins', 'technique', 'autre').optional(),
    categorieVehicule: Joi.string().valid('Camion', 'Remorque').optional(),
    intervalleKm: Joi.number().min(0).allow(null).optional(),
    intervalleTempsMois: Joi.number().min(0).allow(null).optional(),
    seuilAlerteKm: Joi.number().min(0).optional(),
    seuilAlerteMois: Joi.number().min(0).optional(),
    description: Joi.string().allow('').optional(),
});

