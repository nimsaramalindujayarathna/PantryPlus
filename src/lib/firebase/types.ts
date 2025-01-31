export interface FirebaseUser {
  id: string;
  loadCells: {
    [key: string]: {
      weight: number;
    };
  };
}

export interface FirebaseData {
  [userId: string]: FirebaseUser;
}