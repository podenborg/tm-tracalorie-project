// Storage Controller
const StorageController = (function() {
  return {
    storeItem: function(item) {
      let items;

      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(itemId) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (itemId === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    },
    getItemsFromStorage: function() {
      let items;

      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
  };
})();

// Item Controller
const ItemController = (function() {
  // Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Item State
  const itemState = {
    // items: [],
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  return {
    addItem: function(name, calories) {
      let id;
      if (itemState.items.length > 0) {
        id = itemState.items[itemState.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      calories = parseInt(calories);

      const newItem = new Item(id, name, calories);
      itemState.items.push(newItem);
      return newItem;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let updatedItem = null;

      itemState.items.forEach(function(item) {
        if (item.id === itemState.currentItem.id) {
          item.name = name;
          item.calories = calories;
          updatedItem = item;
        }
      });

      return updatedItem;
    },
    deleteItem: function(id) {
      itemIds = itemState.items.map(function(item) {
        return item.id;
      });

      const index = itemIds.indexOf(id);
      itemState.items.splice(index, 1);
    },
    clearAllItems: function() {
      itemState.items = [];
    },
    getItems: function() {
      return itemState.items;
    },
    getItemById: function(id) {
      let matchedItem = null;

      itemState.items.forEach(function(item) {
        if (item.id === id) {
          matchedItem = item;
        }
      });

      return matchedItem;
    },
    getTotalCalories: function() {
      let total = 0;
      itemState.items.forEach(function(item) {
        total += item.calories;
      });
      itemState.totalCalories = total;
      return total;
    },
    getCurrentItem: function() {
      return itemState.currentItem;
    },
    setCurrentItem: function(item) {
      itemState.currentItem = item;
    },
    logState: function() {
      return itemState;
    }
  }
})();

// UI Controller
const UIController = (function() {
  const UISelectors = {
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemList: '#item-list',
    listItems: '#item-list li',
    itemNameInput: '#item-name',
    itemCalorieInput: '#item-calories',
    totalCalories: '.total-calories',
  };

  return {
    addListItem: function(newItem) {
      UIController.showList();

      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${newItem.id}`;
      li.innerHTML = `
        <strong>${newItem.name}: </strong> <em>${newItem.calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute('id');

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    removeListItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        listItem.remove();
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCalorieInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalorieInput).value = ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value, 
        calories: document.querySelector(UISelectors.itemCalorieInput).value
      };
    },
    getSelectors: function() {
      return UISelectors;
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    clearEditState: function() {
      UIController.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}: </strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
  }
})();

// App Controller
const App = (function(StorageController, ItemController, UIController) {
  const attachEventListeners = function() {
    const UISelectors = UIController.getSelectors();

    document.addEventListener('keypress', function(evt) { if (evt.keyCode === 13 || evt.which === 13 ) { evt.preventDefault(); return false; } });
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };

  const itemAddSubmit = function(evt) {
    const input = UIController.getItemInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemController.addItem(input.name, input.calories);
      UIController.addListItem(newItem);
      StorageController.storeItem(newItem);

      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);
      UIController.clearInput();
    }

    evt.preventDefault();
  };

  const itemEditClick = function(evt) {
    if (evt.target.classList.contains('edit-item')) {
      const itemId = parseInt(evt.target.parentNode.parentNode.id.split('-')[1]);
      const itemToEdit = ItemController.getItemById(itemId);
      ItemController.setCurrentItem(itemToEdit);
      UIController.addItemToForm();
    }
    
    evt.preventDefault();
  };

  const itemUpdateSubmit = function(evt) {
    const input = UIController.getItemInput();
    const updatedItem = ItemController.updateItem(input.name, input.calories);
    UIController.updateListItem(updatedItem);

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    StorageController.updateItemStorage(updatedItem);

    UIController.clearEditState();
    evt.preventDefault();
  };

  const itemDeleteSubmit = function(evt) {
    const currentItem = ItemController.getCurrentItem();
    ItemController.deleteItem(currentItem.id);
    UIController.deleteListItem(currentItem.id);

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    StorageController.deleteItemFromStorage(currentItem.id);

    UIController.clearEditState();
    evt.preventDefault();
  };

  const clearAllItemsClick = function(evt) {
    ItemController.clearAllItems();

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    UIController.removeListItems();
    UIController.hideList();
    StorageController.clearItemsFromStorage();
    evt.preventDefault();
  };

  return {
    init: function() {
      UIController.clearEditState();

      const items = ItemController.getItems();
      if (items.length === 0) {
        UIController.hideList();
      } else {
        UIController.populateItemList(items);
      }

      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);  

      attachEventListeners();
    }
  }
})(StorageController, ItemController, UIController);

App.init();