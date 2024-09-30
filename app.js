// Variable to hold extracted text
let extractedText = "";
let imageFile = null;  // To store the uploaded image file

// Image upload event listener
document.getElementById("imageUpload").addEventListener("change", function(event) {
    imageFile = event.target.files[0];  // Store the uploaded file

    if (imageFile) {
        console.log("Image file selected: ", imageFile.name);
    } else {
        console.error("No image selected.");
    }
});

document.getElementById("extractBtn").addEventListener("click", function() {
    if (imageFile) {
        // Show loader while performing OCR
        document.getElementById("extractLoader").style.display = "inline-block";

        // Perform OCR on the uploaded image
        Tesseract.recognize(
            imageFile,
            'eng+hin', // Extract both English and Hindi text
            {
                logger: progress => {
                    console.log(progress); // Optional: log progress
                }
            }
        ).then(({ data: { text } }) => {
            extractedText = text;
            document.getElementById("extractedText").innerText = extractedText;
        }).catch(err => {
            console.error("Error during OCR processing:", err);
        }).finally(() => {
            // Hide loader after extraction is done
            document.getElementById("extractLoader").style.display = "none";
        });
    } else {
        alert("Please upload an image first!");
    }
});

// Keyword search event listener
document.getElementById("searchBtn").addEventListener("click", function() {
    const keyword = document.getElementById("keywordInput").value.trim();

    if (keyword !== "" && extractedText !== "") {
        // Show loader while searching
        document.getElementById("searchLoader").style.display = "inline-block";

        // Highlight the keyword in the extracted text
        const regex = new RegExp(`(${keyword})`, 'gi');
        const highlightedText = extractedText.replace(regex, '<mark>$1</mark>');

        // Display search results
        document.getElementById("searchResults").innerHTML = highlightedText;

        // Hide loader after search
        document.getElementById("searchLoader").style.display = "none";
    } else {
        document.getElementById("searchResults").innerText = "No results found or text extracted.";
    }
});
//------------copy button activation---------------
document.getElementById('copyBtn').addEventListener('click', function() {
    // Get the extracted text
    const extractedText = document.getElementById('extractedText').textContent;

    // Copy the text to clipboard
    navigator.clipboard.writeText(extractedText).then(() => {
        alert("Text copied to clipboard!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
});