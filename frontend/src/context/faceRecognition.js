// utils/faceRecognition.js
import cosineSimilarity from "compute-cosine-similarity";

export const compareEmbeddings = async (storedEmbeddings, newEmbeddings, threshold = 0.5) => {
  if (!Array.isArray(storedEmbeddings[0])) {
    storedEmbeddings = [storedEmbeddings];
  }

  if (!Array.isArray(newEmbeddings[0])) {
    newEmbeddings = [newEmbeddings];
  }

  for (const stored of storedEmbeddings) {
    for (const incoming of newEmbeddings) {
      const similarity = cosineSimilarity(stored, incoming);
      const distance = 1 - similarity;

      if (distance < threshold) {
        return true; // ✅ Match found
      }
    }
  }

  return false; // ❌ No match found
};
