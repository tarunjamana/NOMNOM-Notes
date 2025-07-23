import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { WaterLog } from "../../../types/health";

export const getWaterLog = async (uid: string, date: string): Promise<WaterLog | null> => {
    const docRef = doc(db, `users/${uid}/waterLogs/${date}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as WaterLog
    }

    return null;
}


export const updateWaterLog = async (uid: string, date: string, amountToAdd: number): Promise<WaterLog> => {
    const docRef = doc(db, `users/${uid}/waterLogs/${date}`);
    const existing = await getWaterLog(uid, date);

    const newTotal = (existing?.totalIntake || 0) + amountToAdd;

    const goal = existing?.goal || 3000;

    const newLog: WaterLog = {
        date,
        totalIntake: Math.min(newTotal, goal),
        goal
    }

    await setDoc(docRef, newLog, { merge: true });
    return newLog;
}