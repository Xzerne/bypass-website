async function fetchData() {
    const input = document.getElementById('inputBox').value;
    const resultDiv = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');
    const button = document.querySelector('button');

    if (!input.trim() || !input.startsWith('https://')) {
        showNotification('PLEASE ENTER A VALID URL');
        resultDiv.style.display = 'none';
        copyButton.style.display = 'none'; 
        updateButtonState(false); 
        return; 
    }

    updateButtonState(true);

    try {
        const apiUrl = `https://otaku-is-unbreakable-api.vercel.app/bypass?url=${encodeURIComponent(input)}`;
        const proxyUrl = `https://proxy.cors.sh/${apiUrl}`;

        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
              
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API ERROR:', errorData.error);
            resultDiv.textContent = `RESULT: ${errorData.error || 'API ERROR OCCURRED'}`;
            resultDiv.style.display = 'block';
            copyButton.style.display = 'none'; 
            showNotification('ERROR FETCHING DATA. PLEASE TRY AGAIN.');
            return; 
        }

        const data = await response.json();
        if (data.bypassed === 'Delta bypass hcaptcha patched. We only support links with out hcaptcha.') {
            resultDiv.textContent = `RESULT: undefined`;
            showNotification('ERROR FETCHING DATA. PLEASE TRY AGAIN.');
        } else {
            resultDiv.textContent = `RESULT: ${data.bypassed || 'undefined'}`;
            showNotification('BYPASSED SUCCESSFULLY!');
        }

        resultDiv.style.display = 'block';
        copyButton.style.display = 'block'; 
        document.getElementById('bypassAgainButton').style.display = 'block'; 
    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = 'RESULT: ERROR HAS OCCURRED';
        resultDiv.style.display = 'block';
        copyButton.style.display = 'none'; 
        showNotification('ERROR FETCHING DATA. PLEASE TRY AGAIN.');
    }
}

function copyToClipboard() {
    const resultText = document.getElementById('result').textContent.replace('RESULT: ', '');
    navigator.clipboard.writeText(resultText).then(() => {
        showNotification('TEXT COPIED TO CLIPBOARD.');
    }).catch(err => {
        showNotification('FAILED TO COPY TEXT.');
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    notification.classList.remove('hide');

    if (message === 'PLEASE ENTER A VALID URL') { 
        updateButtonState(false); 
    }

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        updateButtonState(true); 
    }, 3000);
}

function updateButtonState(isValid) {
    const button = document.querySelector('button');
    button.disabled = !isValid;
    if (isValid) {
        button.dispatchEvent(new Event('change')); 
    }
}

document.querySelector('#notification .close-btn').addEventListener('click', () => {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
    notification.classList.add('hide');
});

function toggleSupportInfo() {
    const supportingInfo = document.getElementById('supportingInfo');
    const supportingButton = document.getElementById('supportingButton');

    if (supportingInfo.classList.contains('hide')) {
        supportingInfo.classList.remove('hide');
        supportingInfo.classList.add('show');
        supportingButton.textContent = "HIDE SUPPORTING BYPASS LINKS";
    } else {
        supportingInfo.classList.remove('show');
        supportingInfo.classList.add('hide');
        supportingButton.textContent = "SUPPORTING BYPASS LINKS";
    }
}

function bypassAgain() {
    const resultText = document.getElementById('result').textContent.replace('RESULT: ', '');
    document.getElementById('inputBox').value = resultText;
    location.reload(); 
}

document.getElementById('menuButton').addEventListener('click', () => {
    const menuBar = document.getElementById('menuBar');
    menuBar.classList.toggle('show');
});
