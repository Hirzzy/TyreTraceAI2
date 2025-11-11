'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc, DocumentReference, DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !ref) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setData({ ...docSnap.data(), id: docSnap.id });
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching document:", error);
      setData(null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, ref]);

  return { data, isLoading };
}
