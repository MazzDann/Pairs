jQuery(document).ready(function () {
    let pairs = []
    // Validate name/value pair input
    function validate(input) {
        // Regular expression: alphanumeric name, optional spaces, =, optional spaces, alphanumeric value
        const regex = /^[a-zA-Z0-9]+(\s*)=(\s*)[a-zA-Z0-9]+$/;
        return regex.test(input);
    }
    // Parse input into name and value
    function parse(input) {
        const parts = input.split('=').map(part => part.trim());
        return { name: parts[0], value: parts[1] };
    }
    // Update the listbox with current pairs
    function updateBox() {
        const $list = $('#pairList');
        $list.empty();
        pairs.forEach((pair, index) => {
            $list.append(`<option value="${index}">${pair.name} = ${pair.value}</option>`);
        });
    }
    // Add button click handler
    $('#addButton').click(function () {
        const input = $('#pairInput').val().trim();
        if (!input) {
            showError('Please enter a name/value pair.');
            return;
        }
        if (validate(input)) {
            const pair = parse(input);
            pairs.push(pair);
            updateBox();
            $('#pairInput').val(''); // Clear input
            showError('OK   ');// Show that it worked
        } else {
            showError('Invalid format. Use: name=value (alphanumeric only).');
        }
    });
    // Delete button click handler
    $('#deleteSelected').click(function () {
        const selected = $('#pairList option:selected').map(function () {
            return parseInt($(this).val());
        }).get();
        // Sort indices in descending order to avoid index shifting
        selected.sort((a, b) => b - a).forEach(index => {
            pairs.splice(index, 1);
        });
        updateBox();
    });

    // Display error message
    function showError(message) {
        $('#errorMessage').text(message);
        setTimeout(() => $('#errorMessage').text(''), 3000);
    }
    // Sort by Name button click handler
    $('#sortByName').click(function () {
        pairs.sort((a, b) => a.name.localeCompare(b.name));
        updateBox();
    });

    // Sort by Value button click handler
    $('#sortByValue').click(function () {
        pairs.sort((a, b) => a.value.localeCompare(b.value));
        updateBox();
    });


    // Generate XML string
    function generateXml() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<pairs>\n';
        pairs.forEach(pair => {
            xml += `  <pair>\n    <name>${pair.name}</name>\n    <value>${pair.value}</value>\n  </pair>\n`;
        });
        xml += '</pairs>';
        return xml;
    }

    // Show as XML button click handler
    $('#showXml').click(function () {
        if (pairs.length === 0) {
            showError('No pairs to display as XML.');
            return;
        }
        const xml = generateXml();
        const $xmlOutput = $('#xmlOutput');
        $xmlOutput.text(xml).css('display', 'block');
    });
    // Allow Enter key to add pair
    $('#pairInput').keypress(function (e) {
        if (e.which === 13) {
            $('#addButton').click();
        }
    });

    // Download XML button click handler
    $('#downloadXml').click(function () {
        if (pairs.length === 0) {
            showError('No pairs to download as XML.');
            return;
        }
        const xml = generateXml();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pairs.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Upload XML button click handler
    $('#uploadXml').click(function () {
        $('#xmlFileInput').click();
    });

    // Handle file upload
    $('#xmlFileInput').change(function (event) {
        const file = event.target.files[0];
        if (!file) {
            showError('No file selected.');
            return;
        }
        if (!file.name.endsWith('.xml')) {
            showError('Please select an XML file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            showError('Yeppi')

            const xmlText = e.target.result;
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                    throw new Error('Invalid XML format.');
                }
                const pairNodes = xmlDoc.getElementsByTagName('pair');
                const newPairs = [];
                for (let i = 0; i < pairNodes.length; i++) {
                    const nameNode = pairNodes[i].getElementsByTagName('name')[0];
                    const valueNode = pairNodes[i].getElementsByTagName('value')[0];
                    if (!nameNode || !valueNode) {
                        throw new Error('Missing name or value in pair at index ' + i);
                    }
                    const name = nameNode.textContent;
                    const value = valueNode.textContent;
                    if (name && value && /^[a-zA-Z0-9]+$/.test(name) && /^[a-zA-Z0-9]+$/.test(value)) {
                        newPairs.push({ name, value });
                    } else {
                        throw new Error('Invalid pair at index ' + i + ': ' + (name || 'undefined') + '=' + (value || 'undefined'));
                    }
                }
                pairs = newPairs; // Replace existing pairs
                updateBox();
                $('#xmlOutput').text('').css('display', 'none'); // Hide XML output
                showError('XML file loaded successfully.');
            } catch (error) {
                showError('Error parsing XML file: ' + error.message);
            }
            // Clear file input
            $('#xmlFileInput').val('');
        };
        reader.onerror = function () {
            showError('Error reading file.');
        };
        reader.readAsText(file);
    });
})