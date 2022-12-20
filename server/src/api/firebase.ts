import admin, { ServiceAccount } from 'firebase-admin'

import serviceAccount from './key.json'

export default function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  })
}
