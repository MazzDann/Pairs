jQuery(document).ready(function () {
    let pairs=[]
    // Validate name/value pair input
    function validate(input){
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
    // Show as XML button click handler
    $('#showXml').click(function () {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<pairs>\n';
        pairs.forEach(pair => {
            xml += `  <pair>\n    <name>${pair.name}</name>\n    <value>${pair.value}</value>\n  </pair>\n`;
        });
        xml += '</pairs>';
        $('#xmlOutput').text(xml);
    });
    // Allow Enter key to add pair
    $('#pairInput').keypress(function (e) {
        if (e.which === 13) {
            $('#addButton').click();
        }
    });
})