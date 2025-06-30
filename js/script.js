// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Add click event listener to the button
getImagesButton.addEventListener('click', getSpaceImages);

// Function to fetch space images from NASA's API
async function getSpaceImages() {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates!');
    return;
  }
  
  // Show loading message
  gallery.innerHTML = '<div class="col-12"><div class="placeholder"><div class="placeholder-icon">⏳</div><p>Loading space images...</p></div></div>';
  
  try {
    // Build the NASA APOD API URL
    // APOD = Astronomy Picture of the Day
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=vFaFrZbdflM55RIaPhmIzwxrEj2023USsnpQMF10&start_date=${startDate}&end_date=${endDate}`;
    
    // Fetch data from NASA's API
    const response = await fetch(apiUrl);
    const images = await response.json();
    
    // Clear the gallery
    gallery.innerHTML = '';
    
    // Create a card for each image
    images.forEach(image => {
      createImageCard(image);
    });
    
  } catch (error) {
    // Show error message if something goes wrong
    console.error('Error fetching images:', error);
    gallery.innerHTML = '<div class="col-12"><div class="placeholder"><div class="placeholder-icon">❌</div><p>Error loading images. Please try again!</p></div></div>';
  }
}

// Function to create a card for each space image
function createImageCard(imageData) {
  // Create the column container with Bootstrap responsive classes
  // col-12 = full width on mobile, col-md-4 = third width on medium screens and above
  const colDiv = document.createElement('div');
  colDiv.className = 'col-12 col-md-4 mb-4';
  
  // Create the main card container with Bootstrap card class
  const card = document.createElement('div');
  card.className = 'card h-100'; // h-100 makes all cards the same height
  
  // Create the image element (only if it's actually an image, not a video)
  if (imageData.media_type === 'image') {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.title;
    img.loading = 'lazy'; // Improves page performance
    img.className = 'card-img-top'; // Bootstrap class for card images
    card.appendChild(img);
  } else {
    // If it's a video, show a placeholder
    const videoPlaceholder = document.createElement('div');
    videoPlaceholder.className = 'card-img-top video-placeholder d-flex align-items-center justify-content-center';
    videoPlaceholder.style.height = '200px';
    videoPlaceholder.style.backgroundColor = '#f8f9fa';
    videoPlaceholder.innerHTML = '<span class="text-muted">📹 Video Content</span>';
    card.appendChild(videoPlaceholder);
  }
  
  // Create the card content section
  const cardContent = document.createElement('div');
  cardContent.className = 'card-body';
  
  // Add the title
  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = imageData.title;
  cardContent.appendChild(title);
  
  // Add the date
  const date = document.createElement('p');
  date.className = 'card-text text-muted small mb-2';
  date.textContent = imageData.date;
  cardContent.appendChild(date);
  
  // Add a "View Details" button instead of the explanation text
  const viewButton = document.createElement('button');
  viewButton.className = 'btn btn-primary btn-sm';
  viewButton.textContent = 'View Details';
  viewButton.addEventListener('click', () => openImageModal(imageData));
  cardContent.appendChild(viewButton);
  
  // Add the content to the card
  card.appendChild(cardContent);
  
  // Add the card to the column container
  colDiv.appendChild(card);
  
  // Add the completed column to the gallery
  gallery.appendChild(colDiv);
}

// Function to open the modal and display image details
function openImageModal(imageData) {
  // Get modal elements
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  const modalImageContainer = document.getElementById('modalImageContainer');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalExplanation = document.getElementById('modalExplanation');
  
  // Clear previous content
  modalImageContainer.innerHTML = '';
  
  // Add the image or video content to modal
  if (imageData.media_type === 'image') {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.title;
    img.className = 'img-fluid rounded'; // Bootstrap responsive image
    img.style.maxHeight = '400px'; // Limit height so modal doesn't get too tall
    modalImageContainer.appendChild(img);
  } else {
    // If it's a video, create an embedded video player
    const videoContainer = document.createElement('div');
    videoContainer.className = 'ratio ratio-16x9';
    videoContainer.innerHTML = `<iframe src="${imageData.url}" allowfullscreen></iframe>`;
    modalImageContainer.appendChild(videoContainer);
  }
  
  // Populate modal content
  modalTitle.textContent = imageData.title;
  modalDate.textContent = `Date: ${imageData.date}`;
  modalExplanation.textContent = imageData.explanation;
  
  // Show the modal
  modal.show();
}
