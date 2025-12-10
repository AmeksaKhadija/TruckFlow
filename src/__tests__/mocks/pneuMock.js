export const mockPneuData = {
    _id: '675a3c4d5e6f7g8h9i0j',
    reference: 'PNEU-001',
    typeVehicule: 'Camion', 
    vehiculeId: '675a1b2c3d4e5f6g7h8i',
    position: 'avant_gauche',
    etat: 'neuf',
    usurePourcentage: 0,
    dateInstallation: new Date('2024-01-15'),
    kilometrageInstallation: 150000,
    marque: 'Michelin',
    modele: 'XZY3',
    dimension: '315/80R22.5',
    pression: 8.5,
    remarques: 'Pneu neuf installé',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockPneuDataUpdated = {
    ...mockPneuData,
    usurePourcentage: 30,
    etat: 'moyen',
    remarques: 'Usure normale',
};

export const mockPneuList = [mockPneuData];