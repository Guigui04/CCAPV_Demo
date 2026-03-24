import React, { useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Alert } from '../types';
import { toast } from 'sonner';

const PushNotificationManager: React.FC = () => {
  const isFirstLoad = useRef(true);
  const lastAlertId = useRef<string | null>(null);

  useEffect(() => {
    // Demander la permission pour les notifications du navigateur
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      const latestAlert = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      } as Alert;

      // Ne pas notifier au premier chargement, seulement pour les nouvelles alertes
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        lastAlertId.current = latestAlert.id;
        return;
      }

      // Si c'est une nouvelle alerte
      if (latestAlert.id !== lastAlertId.current) {
        lastAlertId.current = latestAlert.id;

        // Notification in-app (Toast)
        toast.info(latestAlert.title, {
          description: latestAlert.message,
          duration: 5000,
        });

        // Notification système (Push)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(latestAlert.title, {
            body: latestAlert.message,
            icon: '/favicon.ico' // Optionnel, si vous avez une icône
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // Ce composant ne rend rien visuellement
};

export default PushNotificationManager;
