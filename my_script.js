jQuery(document).ready(function () {
    let pairs=[]
    function validate(input){
        const regex = /^[a-zA-Z0-9]+(\s*)=(\s*)[a-zA-Z0-9]+$/;
        return regex.test(input);
    }

    $('#addButton').click(function () {
        const input = $('#pairInput').val().trim();
        if (!input) {
            showError('Please enter a name/value pair.');
            return;
        }
        if (validate(input)) {
            $('#pairInput').val(''); 
            showError('OK   ');
        } else {
            showError('Invalid format. Use: name=value (alphanumeric only).');
        }
    });

    function showError(message) {
        $('#errorMessage').text(message);
        setTimeout(() => $('#errorMessage').text(''), 3000);
    }
})