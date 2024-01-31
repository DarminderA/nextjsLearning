import React, { useEffect, useState } from 'react';

const RestApiCalls = () => {
  const [accessToken, setAccessToken] = useState('');
  const [tokenType, setTokenType] = useState('');

  useEffect(() => {
    const startRestAPICalls = async () => {
      // Get token
      const tokenEndpoint = '/services/iam/oauth/token';
      const tokenHeaders = new Headers({
        'Authorization': 'Basic dmlld2VyX2FwcDpoZ1ZROTZHSTBudG4=',
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const contentData = getEncodedContentData();
      const tokenResult = await callApi(tokenEndpoint, 'POST', tokenHeaders, contentData);

      // Extract and store access token and token type
      const accessToken = tokenResult.access_token;
      const tokenType = tokenResult.token_type;
      setAccessToken(accessToken);
      setTokenType(tokenType);

      // Call to get projects
      const projectsEndpoint = '/services/iam/api/account/projects';
      const projectsHeaders = new Headers({
        'Authorization': `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      });
      const projectsResult = await callApi(projectsEndpoint, 'GET', projectsHeaders);

      if (projectsResult) {
        console.log(projectsResult);
        // Assuming projectsResult contains the list of projects
        if (projectsResult.length > 0) {
          const firstProjectId = projectsResult[0].id;

          // Call to get schedules for the first project
          const schedulesEndpoint = `/services/project/api/projects/${firstProjectId}/schedules?page=0&size=2000`;
          const schedulesHeaders = new Headers({
            'Authorization': `${tokenType} ${accessToken}`,
            'Content-Type': 'application/json',
          });
          const scheduleResult = await callApi(schedulesEndpoint, 'GET', schedulesHeaders);
          console.log(scheduleResult);
        }
      }
    };

    startRestAPICalls();
  }, []); // Empty dependency array to run the effect only once

  const callApi = async (endpoint, method, headers, body = null) => {
    const apiUrl = `https://cloud.xyzreality.com${endpoint}`;

    const requestOptions = {
      method: method,
      headers: headers,
      body: body,
    };

    try {
      const response = await fetch(apiUrl, requestOptions);

      // Check if the response has a valid status
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json(); // Parse response as JSON
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const getEncodedContentData = () => {
    const escapedUsername = encodeURIComponent('darminder.atker@xyzreality.com');
    const escapedPassword = encodeURIComponent('XYZpassword!');

    const escapedContentData = `grant_type=password&username=${escapedUsername}&password=${escapedPassword}`;
    return new URLSearchParams(escapedContentData);
  };

  return (
    <div>
      <p>Access Token: {accessToken}</p>
      <p>Token Type: {tokenType}</p>
      {/* Render other components or data as needed */}
    </div>
  );
};

export default RestApiCalls;
