// List of collections to clear
const collections = [
    'apis', 
    'agents', 
    'pikachats', 
    'collections', 
    'models', 
    'prompts', 
    'taskresults', 
    'tasks', 
    'parameterdefinitions'
];

// Function to clear collections
const clearCollections = async () => {
    collections.forEach(async (collectionName) => {
        const result = await db.getCollection(collectionName).deleteMany({});
        print(`Deleted ${result.deletedCount} documents from ${collectionName}`);
    });
};

// Call the function to clear collections
clearCollections();
