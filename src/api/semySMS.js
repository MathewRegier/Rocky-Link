// semySMS.js
import axios from 'axios';
import qs from 'qs';  // qs is used to format the body as form data

// Log the environment variables to verify they are being picked up
console.log("SEMY SMS User Token:", process.env.SEMYSMS_USER_TOKEN);
console.log("SEMY SMS Device ID:", process.env.SEMYSMS_DEVICE_ID);

export async function sendSMS(phone, message, device) {
  const userToken = process.env.SEMYSMS_USER_TOKEN;

  try {
      const response = await axios({
          method: 'post',
          url: 'https://semysms.net/api/3/sms.php',
          data: qs.stringify({
              token: userToken,
              device: device,
              phone: phone,
              msg: message,
          }),
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
  }
}