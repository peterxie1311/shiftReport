import React from 'react';

function SignatureUpdater() {
    // Function to update the signature
    function updateSignature() {
        // Get the date container element by its id
        const dateContainer = document.getElementById("signature");

        // Check if the element exists
        if (dateContainer instanceof HTMLElement) {
            // Create a new Date object for the current date
            const currentDate = new Date();

            // Format the date to only include the year
            const formattedDate = currentDate.toLocaleDateString(undefined, { year: 'numeric' });

            // Update the text content of the element with the formatted date
            dateContainer.textContent = `© ${formattedDate} Witron Service Australia`;
           
        } else {
            // Handle the case where the element with id "signature" is not found
            console.error("Element with id 'signature' not found");
        }
    }

    // Call the function when the component mounts
    React.useEffect(() => {
        
        updateSignature();
    }, []);

    // Render an empty element (this component doesn't render any visible content)
    return null;
}




export default SignatureUpdater;
