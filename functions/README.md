Firebase Functions for Auth↔Firestore sync

How to use

1. From the project root, go to the functions folder:

```bash
cd functions
```

2. Install dependencies:

```bash
npm install
```

3. Build the functions (TypeScript -> JavaScript):

```bash
npm run build
```

4. Deploy to Firebase (make sure you're logged in and the correct project is selected):

```bash
firebase deploy --only functions
```

Notes
- The functions use the Admin SDK so they bypass Firestore rules (intended for trusted server-side tasks).
- If you need to delete user subcollections, implement a recursive delete (or use `admin.firestore().recursiveDelete()` if available in your SDK).