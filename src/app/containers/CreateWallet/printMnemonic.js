export function print(mnemonic)
{
    var mywindow = window.open('', 'PRINT', 'height=600,width=600');

    mywindow.document.write(mnemonic);

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}