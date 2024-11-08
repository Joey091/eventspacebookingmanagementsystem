"use client";

import React, { useEffect, useState } from 'react';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  getDoc 
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from '@/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

function Reservations() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State to store user emails
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    // Listen to authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
        toast.error("Please log in to continue.");
      }
    });

    // Only proceed if user is admin
    if (userRole !== 'admin') {
      setLoading(false);
      return;
    }

    // Fetch reservations
    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, orderBy('appliedAt', 'desc'));
    const unsubscribeReservations = onSnapshot(q, async (querySnapshot) => {
      const reservationsData = [];
      const userIds = new Set(); // To store unique userIds

      querySnapshot.forEach((doc) => {
        reservationsData.push({ id: doc.id, ...doc.data() });
        userIds.add(doc.data().userId);
      });

      setReservations(reservationsData);

      // Fetch user emails
      const emails = {};
      const promises = Array.from(userIds).map(async (uid) => {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          emails[uid] = userDoc.data().email;
        } else {
          emails[uid] = "Unknown User";
        }
      });

      await Promise.all(promises);
      setUserEmails(emails);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to fetch reservations.");
      setLoading(false);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeAuth();
      unsubscribeReservations();
    };
  }, [auth, db, userRole]);

  const handleApprove = async (reservationId) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      await updateDoc(reservationRef, {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: user.uid,
      });
      toast.success("Reservation approved.");
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error("Failed to approve reservation.");
    }
  };

  const handleReject = async (reservationId) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      await updateDoc(reservationRef, {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: user.uid,
      });
      toast.success("Reservation rejected.");
    } catch (error) {
      console.error("Error rejecting reservation:", error);
      toast.error("Failed to reject reservation.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reservations Management</h1>
      {reservations.length === 0 ? (
        <p className="text-gray-700">No reservations found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Title</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
        
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.eventTitle}</TableCell>
                <TableCell>
                  {userEmails[reservation.userId] || "Loading..."}
                </TableCell>
                <TableCell>{reservation.startDate.toDate().toLocaleDateString()}</TableCell>
                <TableCell>{reservation.endDate.toDate().toLocaleDateString()}</TableCell>
                <TableCell className={
                  reservation.status === 'approved' ? 'text-green-600' :
                  reservation.status === 'rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </TableCell>
                <TableCell>
                  {reservation.status === 'pending' &&
                    <div className="flex space-x-2">
                      <Button variant="success" size="sm" onClick={() => handleApprove(reservation.id)}>
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(reservation.id)}>
                        Reject
                      </Button>
                    </div>
                    }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Reservations;
