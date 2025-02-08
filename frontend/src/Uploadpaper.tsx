import { For } from "solid-js";

const uploadedPapers = [
  {
    id: 1,
    title: "Quantum Computing for Beginners",
    author: "Dr. Alice",
    description: "An introduction to quantum computing and its applications.",
    fileURL: "https://testnet.greenfield.bnbchain.org/quantum-computing.pdf",
    uploadedAt: "2024-02-08",
  },
  {
    id: 2,
    title: "Blockchain and DeSci Revolution",
    author: "Dr. Bob",
    description: "Exploring how decentralized science (DeSci) can transform research.",
    fileURL: "https://testnet.greenfield.bnbchain.org/blockchain-desc.pdf",
    uploadedAt: "2024-02-07",
  },
];

const UploadPaper = () => {
  return (
    <div>
      <h1 >Upload Your Research Paper</h1>

      {/* Upload Form */}
      <div class="mb-6">
        <label class="block mb-2 font-semibold">Select PDF File</label>
        <input type="file" accept=".pdf" class="block w-full p-2 border rounded-md mb-4" />

        <label class="block mb-2 font-semibold">Add a Description</label>
        <textarea class="block w-full p-3 border rounded-md" rows="4" placeholder="Write a description..."></textarea>

        <button class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
          Upload Paper
        </button>
      </div>

      {/* Uploaded Papers */}
      <h2 class="text-xl font-bold mb-3">Uploaded Papers</h2>
      <div class="space-y-4">
        <For each={uploadedPapers}>
          {(paper) => (
            <div class="border p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-bold">{paper.title}</h3>
              <p class="text-gray-600">By {paper.author} - {paper.uploadedAt}</p>
              <p class="text-gray-700">{paper.description}</p>
              <a href={paper.fileURL} target="_blank" class="text-blue-500 hover:underline">
                View Paper
              </a>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default UploadPaper;
