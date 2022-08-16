import axios from 'axios';

// module.exports.getSecrets = () => {
//   axios
//     .get(
//       `https://${process.env.DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`,
//     )
//     .then(res => {
//       return res.data;
//     })
//     .catch(err => console.log('something went wrong with fetching doppler secrets'));
//   // console.log('response:', response.data);
//   // return response.data;
// };

class DopplerService {
  secrets: object = null;
  constructor() {
    this.fetchSecrets();
  }

  fetchSecrets = () => {
    axios
      .get(
        `https://${process.env.DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`,
      )
      .then(res => {
        // this.secrets = res.data;
        console.log('res.data:', res.data);
        return res.data;
      })
      .catch(err => console.log('something went wrong with fetching doppler secrets'));
    // console.log('response:', response.data);
    // return response.data;
  };

  getSecrets = () => this.secrets;
}

module.exports = DopplerService;
