jQuery(document).ready(function () {
    let pairs=[]
    function validate(input){
        const regex = /^[a-zA-Z0-9]+(\s*)=(\s*)[a-zA-Z0-9]+$/;
        return regex.test(input);
    }
    function parse(input) {
        const parts = input.split('=').map(part => part.trim());
        return { name: parts[0], value: parts[1] };
    }
    function updateBox() {
        const $list = $('#pairList');
        $list.empty();
        pairs.forEach((pair, index) => {
            $list.append(`<option value="${index}">${pair.name} = ${pair.value}</option>`);
        });
    }
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
            $('#pairInput').val(''); 
            showError('OK   ');
        } else {
            showError('Invalid format. Use: name=value (alphanumeric only).');
        }
    });
    $('#deleteSelected').click(function () {
        const selected = $('#pairList option:selected').map(function () {
            return parseInt($(this).val());
        }).get();
        selected.sort((a, b) => b - a).forEach(index => {
            pairs.splice(index, 1);
        });
        updateBox();
    });

    function showError(message) {
        $('#errorMessage').text(message);
        setTimeout(() => $('#errorMessage').text(''), 3000);
    }
    $('#sortByName').click(function () {
        pairs.sort((a, b) => a.name.localeCompare(b.name));
        updateBox();
    });

    $('#sortByValue').click(function () {
        pairs.sort((a, b) => a.value.localeCompare(b.value));
        updateBox();
    });
    $('#showXml').click(function () {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<pairs>\n';
        pairs.forEach(pair => {
            xml += `  <pair>\n    <name>${pair.name}</name>\n    <value>${pair.value}</value>\n  </pair>\n`;
        });
        xml += '</pairs>';
        $('#xmlOutput').text(xml);
    });
})