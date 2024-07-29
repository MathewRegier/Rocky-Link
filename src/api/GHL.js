// GHL.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getContacts(apiKey) {
  try {
    const params = {
      limit: '20',
      query: '+12269611073' // This can be adjusted as needed
    };

    const response = await axios.get('https://rest.gohighlevel.com/v1/contacts', {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: params // Passing query parameters
    });
    return response.data;
  } catch (error) {
    console.error('Error getting contacts:', error.response ? error.response.data : error.message);
    return null;
  }
}

export async function getUsersByLocation(locationId, apiKey) {
  const url = `https://rest.gohighlevel.com/v1/users/?locationId=${locationId}`;

  try {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.data && response.data.length > 0) {
        console.log('Users found:', response.data.length);
        return response.data;  // Return all users found
    } else {
        console.log('No users found for the provided location ID:', locationId);
        return [];  // Return an empty array if no users found
    }
  } catch (error) {
    console.error('Error retrieving users by location ID:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    return null;  // Return null if there is an error in the API call
  }
}

export async function getCustomFields(apiKey) {
  try {
    const response = await axios.get('https://rest.gohighlevel.com/v1/custom-fields', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data; // Returns the data part of the response from the server
  } catch (error) {
    console.error('Error fetching custom fields:', error.response ? error.response.data : error.message);
    return null; // Return null or handle the error as needed
  }
}

export async function updateContactCustomField(contactId, fieldId, fieldValue, apiKey) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;
  const data = {
      customField: {
          [fieldId]: fieldValue  // Use computed property names to set the field dynamically
      }
  };
  try {
    const response = await axios.put(url, data, {
      headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
      }
    });
    return response.data; // This will return the response data from the server
  } catch (error) {
    console.error('Failed to update contact custom field:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function getContactIdByPhoneNumber(phoneNumber, apiKey) {
  // Convert phoneNumber to string and ensure it has +1 country code
  phoneNumber = String(phoneNumber);
  if (!phoneNumber.startsWith('+1')) {
    phoneNumber = `+1${phoneNumber}`;
  }

  const encodedPhone = encodeURIComponent(phoneNumber);
  const url = `https://rest.gohighlevel.com/v1/contacts?query=${encodedPhone}`;

  try {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.data.contacts && response.data.contacts.length > 0) {
        //console.log('Contact found:', response.data.contacts[0]);
        return response.data.contacts[0].id;  // Return the ID of the first contact found
    } else {
        console.log('No contact found for the provided phone number:', phoneNumber);
        return null;  // Return null if no contact found
    }
  } catch (error) {
    console.error('Error retrieving ContactID by phone number:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    return null;  // Return null if there is an error in the API call
  }
}

export async function createContact(contactData, apiKey) {
  const url = 'https://rest.gohighlevel.com/v1/contacts/';
  try {
      const response = await axios.post(url, contactData, {
          headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error creating contact:', error.response ? error.response.data : error.message);
      return null;
  }
}

// Function to get contacts by tag
export async function getContactsByTag(tag, apiKey) {
  try {
      const response = await axios.get(`https://rest.gohighlevel.com/v1/contacts?query=${encodeURIComponent(tag)}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (response.data && response.data.contacts) {
          console.log(`Contacts fetched: ${response.data.contacts.length}`);
          return response.data.contacts;  // Return all contacts found
      } else {
          console.log('No contacts found for the tag:', tag);
          return [];  // Return an empty array if no contacts found
      }
  } catch (error) {
      console.error('Error fetching contacts by tag:', error.response ? error.response.data : error.message);
      return null;  // Return null if there is an error
  }
}

// New function to get workflows
export async function getWorkflows(apiKey) {
  const url = `https://rest.gohighlevel.com/v1/workflows/`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Workflows API response:', response.data); // Add this line for debugging
    return response.data; // This will return the response data from the server
  } catch (error) {
    console.error('Failed to fetch workflows:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// New function to add a contact to a workflow
export async function addContactToWorkflow(contactId, workflowId, eventStartTime, apiKey) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}/workflow/${workflowId}`;
  const data = {
    eventStartTime: eventStartTime
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
      }
    });
    return response.data; // This will return the response data from the server
  } catch (error) {
    console.error('Failed to add contact to workflow:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function addTagToContact(contactId, tag, apiKey) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;
  
  try {
    // First, get the existing contact details to retrieve existing tags
    const getResponse = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const contact = getResponse.data;

    // Add the new tag to the existing tags
    const tags = contact.tags || [];
    tags.push(tag);

    // Prepare the data for the update request
    const data = {
      tags: tags
    };

    // Make the PUT request to update the contact
    const response = await axios.put(url, data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding tag to contact:', error.response ? error.response.data : error.message);
    throw error;
  }
}