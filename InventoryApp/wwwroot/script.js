$(document).ready(function () {
    loadItems();

    $('#itemForm').on('submit', function (e) {
        e.preventDefault();
        saveItem();
    });

    $(document).on('click', '.edit-item', function () {
        const id = $(this).data('id');
        loadItem(id);
    });

    $(document).on('click', '.delete-item', function () {
        const id = $(this).data('id');
        deleteItem(id);
    });
});

// Load all items
function loadItems() {
    $.getJSON('/api/items', function (items) {
        const itemList = $('#itemList');
        itemList.empty();
        $.each(items, function (index, item) {
            const itemRow = $(`
                <li>
                    ${item.name} - SKU: ${item.sku} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}
                    <button class="edit-item" data-id="${item.id}">Edit</button>
                    <button class="delete-item" data-id="${item.id}">Delete</button>
                </li>
            `);
            itemList.append(itemRow);
        });
    }).fail(function () {
        alert('Error loading items.');
    });
}

// Load a specific item for editing
function loadItem(id) {
    $.getJSON(`/api/items/${id}`, function (item) {
        $('#itemForm')[0].reset();
        $('#itemId').val(item.id);
        $('#name').val(item.name);
        $('#sku').val(item.sku);
        $('#quantity').val(item.quantity);
        $('#price').val(item.price);
        $('#serial').val(item.serial || '');
        $('#expiresAt').val(item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : '');
    }).fail(function () {
        alert('Error loading item.');
    });
}

// Save (create or update) an item
function saveItem() {
    const itemId = $('#itemId').val();
    const item = {
        id: itemId ? parseInt(itemId) : undefined,  // Include ID only for PUT
        name: $('#name').val(),
        sku: $('#sku').val(),
        quantity: parseFloat($('#quantity').val()),
        price: parseFloat($('#price').val()),
        serial: $('#serial').val() || null,
        expiresAt: $('#expiresAt').val() ? new Date($('#expiresAt').val()).toISOString() : null
    };

    const requestType = itemId ? 'PUT' : 'POST';
    const requestUrl = itemId ? `/api/items/${itemId}` : '/api/items';

    $.ajax({
        url: requestUrl,
        type: requestType,
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: function () {
            alert('Item saved successfully.');
            $('#itemForm')[0].reset();
            $('#itemId').val('');
            loadItems();
        },
        error: function () {
            alert('Error saving item.');
        }
    });
}

// Delete an item
function deleteItem(id) {
    $.ajax({
        url: `/api/items/${id}`,
        type: 'DELETE',
        success: function () {
            alert('Item deleted successfully.');
            loadItems();
        },
        error: function () {
            alert('Error deleting item.');
        }
    });
}
