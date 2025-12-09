export const mockCamionData = {
    _id: '675a1b2c3d4e5f6g7h8i',
    matricule: 'AA-123-BB',
    marque: 'Volvo',
    modele: 'FH16',
    kilometrage: 0,
    etatPneu: 'bon',
    capaciteCharge: 25000,
    anneeFabrication: 2020,
    carburantRestant: 0,
    etatGeneral: 'bon',
    estActif: true,
    derniereMaintenanceDate: null,
    prochainEntretien: null,
    remarques: 'Camion en bon état',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockCamionDataUpdated = {
    ...mockCamionData,
    kilometrage: 5000,
    etatPneu: 'moyen',
    remarques: 'Pneus usés',
};

export const mockCamionList = [mockCamionData];