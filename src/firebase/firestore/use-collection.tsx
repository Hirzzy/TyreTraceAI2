'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, CollectionReference, DocumentData, Query } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T = DocumentData>(ref: CollectionReference<T> | Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !ref) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(items);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching collection:", error);
      setData([]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, ref]);

  return { data, isLoading };
}
