import { jest } from '@jest/globals';
import {
    getAllCamions,
    getCamionById,
    createCamion,
    updateCamion,
    deleteCamion,
    getCamionsActifs,
    updateKilometrage
} from '../../controllers/camionController.js';
import Camion from '../../models/camionModel.js';
import { mockCamionData, mockCamionDataUpdated, mockCamionList } from '../mocks/camionMock.js';

// Mock Mongoose Model
jest.mock('../../models/camionModel.js');

describe('CamionController', () => {
    let req, res, next;

    beforeEach(() => {
        // Réinitialiser les mocks avant chaque test
        jest.clearAllMocks();

        // Mock request et response
        req = {
            params: {},
            body: {},
            user: { role: 'admin', _id: 'user_123' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    // ========================
    // TEST: getAllCamions
    // ========================
    describe('getAllCamions', () => {
        it('✅ devrait retourner tous les camions avec le statut 200', async () => {
            // Arrange
            Camion.find = jest.fn().mockReturnThis();
            Camion.sort = jest.fn().mockResolvedValue(mockCamionList);

            // Act
            await getAllCamions(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 1,
                data: mockCamionList,
            });
        });

        // ✅ CORRIGÉ : Chaîner correctement le rejet
        it('❌ devrait retourner une erreur 500 en cas de problème', async () => {
            // Arrange
            const error = new Error('Erreur base de données');

            // ✅ CORRECT : Retourner un objet avec sort() qui rejette
            Camion.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockRejectedValue(error),
            });

            // Act
            await getAllCamions(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erreur base de données',
            });
        });

        it('✅ devrait retourner une liste vide si aucun camion', async () => {
            // Arrange
            Camion.find = jest.fn().mockReturnThis();
            Camion.sort = jest.fn().mockResolvedValue([]);

            // Act
            await getAllCamions(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 0,
                data: [],
            });
        });
    });

    // ========================
    // TEST: getCamionById
    // ========================
    describe('getCamionById', () => {
        it('✅ devrait retourner un camion par ID', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            Camion.findById = jest.fn().mockResolvedValue(mockCamionData);

            // Act
            await getCamionById(req, res);

            // Assert
            expect(Camion.findById).toHaveBeenCalledWith(mockCamionData._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockCamionData,
            });
        });

        it('❌ devrait retourner 404 si camion non trouvé', async () => {
            // Arrange
            req.params.id = 'invalid_id';
            Camion.findById = jest.fn().mockResolvedValue(null);

            // Act
            await getCamionById(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Camion non trouvé',
            });
        });

        it('❌ devrait retourner 500 en cas d\'erreur serveur', async () => {
            // Arrange
            req.params.id = 'some_id';
            const error = new Error('Erreur connexion DB');
            Camion.findById = jest.fn().mockRejectedValue(error);

            // Act
            await getCamionById(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erreur connexion DB',
            });
        });
    });

    // ========================
    // TEST: createCamion
    // ========================
    describe('createCamion', () => {
        it('✅ devrait créer un nouveau camion avec statut 201', async () => {
            // Arrange
            req.body = {
                matricule: 'AA-123-BB',
                marque: 'Volvo',
                modele: 'FH16',
                capaciteCharge: 25000,
                anneeFabrication: 2020,
            };

            // ✅ CORRECTION : Mock le modèle Camion correctement
            Camion.findOne = jest.fn().mockResolvedValue(null); // Pas de doublons

            // Mock le constructeur et la méthode save
            Camion.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockCamionData),
            }));

            // Act
            await createCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Camion créé avec succès',
                data: mockCamionData,
            });
        });

        it('❌ devrait retourner 400 si champs manquants', async () => {
            // Arrange
            req.body = {
                matricule: 'AA-123-BB',
                marque: 'Volvo',
                // Champs manquants
            };

            // Act
            await createCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Tous les champs requis doivent être remplis',
            });
        });

        it('❌ devrait retourner 400 si matricule déjà existant', async () => {
            // Arrange
            req.body = {
                matricule: 'AA-123-BB',
                marque: 'Volvo',
                modele: 'FH16',
                capaciteCharge: 25000,
                anneeFabrication: 2020,
            };

            Camion.findOne = jest.fn().mockResolvedValue(mockCamionData); // Matricule existe

            // Act
            await createCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Ce matricule existe déjà',
            });
        });

        it('❌ devrait retourner 500 en cas d\'erreur', async () => {
            // Arrange
            req.body = {
                matricule: 'AA-123-BB',
                marque: 'Volvo',
                modele: 'FH16',
                capaciteCharge: 25000,
                anneeFabrication: 2020,
            };

            const error = new Error('Erreur base de données');
            Camion.findOne = jest.fn().mockRejectedValue(error);

            // Act
            await createCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erreur base de données',
            });
        });
    });

    // ========================
    // TEST: updateCamion
    // ========================
    describe('updateCamion', () => {
        it('✅ devrait mettre à jour un camion', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            req.body = { kilometrage: 5000 };

            Camion.findOne = jest.fn().mockResolvedValue(null);
            Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCamionDataUpdated);

            // Act
            await updateCamion(req, res);

            // Assert
            expect(Camion.findByIdAndUpdate).toHaveBeenCalledWith(
                mockCamionData._id,
                req.body,
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Camion modifié avec succès',
                data: mockCamionDataUpdated,
            });
        });

        it('❌ devrait retourner 404 si camion non trouvé', async () => {
            // Arrange
            req.params.id = 'invalid_id';
            req.body = { kilometrage: 5000 };

            Camion.findOne = jest.fn().mockResolvedValue(null);
            Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            // Act
            await updateCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Camion non trouvé',
            });
        });

        it('❌ devrait retourner 400 si matricule déjà utilisé', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            req.body = { matricule: 'AA-999-CC' };

            // Autre camion avec ce matricule
            const anotherCamion = { ...mockCamionData, _id: 'other_id' };
            Camion.findOne = jest.fn().mockResolvedValue(anotherCamion);

            // Act
            await updateCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Ce matricule existe déjà',
            });
        });
    });

    // ========================
    // TEST: deleteCamion
    // ========================
    describe('deleteCamion', () => {
        it('✅ devrait supprimer un camion', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            Camion.findByIdAndDelete = jest.fn().mockResolvedValue(mockCamionData);

            // Act
            await deleteCamion(req, res);

            // Assert
            expect(Camion.findByIdAndDelete).toHaveBeenCalledWith(mockCamionData._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Camion supprimé avec succès',
                data: mockCamionData,
            });
        });

        it('❌ devrait retourner 404 si camion non trouvé', async () => {
            // Arrange
            req.params.id = 'invalid_id';
            Camion.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            // Act
            await deleteCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Camion non trouvé',
            });
        });

        it('❌ devrait retourner 500 en cas d\'erreur', async () => {
            // Arrange
            req.params.id = 'some_id';
            const error = new Error('Erreur base de données');
            Camion.findByIdAndDelete = jest.fn().mockRejectedValue(error);

            // Act
            await deleteCamion(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ========================
    // TEST: getCamionsActifs
    // ========================
    describe('getCamionsActifs', () => {
        it('✅ devrait retourner les camions actifs', async () => {
            // Arrange
            const activeCamions = [{ ...mockCamionData, estActif: true }];
            Camion.find = jest.fn().mockReturnThis();
            Camion.sort = jest.fn().mockResolvedValue(activeCamions);

            // Act
            await getCamionsActifs(req, res);

            // Assert
            expect(Camion.find).toHaveBeenCalledWith({ estActif: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 1,
                data: activeCamions,
            });
        });
    });

    // ========================
    // TEST: updateKilometrage
    // ========================
    describe('updateKilometrage', () => {
        it('✅ devrait mettre à jour le kilométrage', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            req.body = { kilometrage: 10500 };

            const updatedCamion = { ...mockCamionData, kilometrage: 10500 };
            Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCamion);

            // Act
            await updateKilometrage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Kilométrage mis à jour',
                data: updatedCamion,
            });
        });

        it('❌ devrait retourner 400 si kilométrage invalide', async () => {
            // Arrange
            req.params.id = mockCamionData._id;
            req.body = { kilometrage: -100 };

            // Act
            await updateKilometrage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Kilométrage invalide',
            });
        });

        it('❌ devrait retourner 404 si camion non trouvé', async () => {
            // Arrange
            req.params.id = 'invalid_id';
            req.body = { kilometrage: 10500 };

            Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            // Act
            await updateKilometrage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Camion non trouvé',
            });
        });
    });
});