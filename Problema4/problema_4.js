$(function () {
    $('.sortable').each(function () {
        const $table = $(this);
        if ($table.hasClass('horizontal')) {
            initHorizontalTable($table);
        } else if ($table.hasClass('vertical')) {
            initVerticalTable($table);
        }
    });
});

function initHorizontalTable($table) {
    $table.find('thead th.sortable').each(function (colIndex) {
        $(this).on('click', function () {
            const $header = $(this);
            let direction;

            if ($header.hasClass('sorted-asc')) {
                direction = 'desc';
            } else if ($header.hasClass('sorted-desc')) {
                direction = 'asc';
            } else {
                direction = 'asc';
            }

            $table.find('th.sortable').removeClass('sorted-asc sorted-desc');
            $header.addClass(`sorted-${direction}`);

            sortHorizontalTable($table, colIndex, direction);
        });
    });
}

function sortHorizontalTable($table, colIndex, direction) {
    const $tbody = $table.find('tbody');
    const $rows = $tbody.find('tr').get();

    $rows.sort((rowA, rowB) => {
        const cellA = $(rowA).children().eq(colIndex).text().trim();
        const cellB = $(rowB).children().eq(colIndex).text().trim();
        return compareValues(cellA, cellB, direction);
    });

    $tbody.empty().append($rows);
}

function initVerticalTable($table) {
    $table.find('tr > th.sortable').each(function (rowIndex) {
        $(this).on('click', function () {
            const $header = $(this);
            let direction;

            if ($header.hasClass('sorted-asc')) {
                direction = 'desc';
            } else if ($header.hasClass('sorted-desc')) {
                direction = 'asc';
            } else {
                direction = 'asc';
            }

            $table.find('th.sortable').removeClass('sorted-asc sorted-desc');
            $header.addClass(`sorted-${direction}`);

            sortVerticalTable($table, rowIndex, direction);
        });
    });
}

function sortVerticalTable($table, rowIndex, direction) {
    const $rows = $table.find('tr');
    const numCols = $rows.first().children().length - 1;

    const indexedCells = [];
    for (let col = 0; col < numCols; col++) {
        const cellValue = $rows.eq(rowIndex).children().eq(col + 1).text().trim();
        indexedCells.push({ index: col, value: cellValue });
    }

    indexedCells.sort((a, b) => compareValues(a.value, b.value, direction));

    $rows.each(function () {
        const $row = $(this);
        const staticCell = $row.children().eq(0).clone(true, true);

        const $cells = $row.children().slice(1);
        const newOrder = indexedCells.map(({ index }) => $cells.eq(index));

        $row.empty().append(staticCell);
        newOrder.forEach(cell => $row.append(cell));
    });
}

function compareValues(a, b, direction) {
    const numA = parseFloat(a.replace(/[^\d.-]/g, ''));
    const numB = parseFloat(b.replace(/[^\d.-]/g, ''));

    if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
    }

    return direction === 'asc'
        ? a.localeCompare(b, 'ro', { sensitivity: 'base' })
        : b.localeCompare(a, 'ro', { sensitivity: 'base' });
}
