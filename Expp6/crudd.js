// Initial array
let list = ["Item 1", "Item 2", "Item 3"];
console.log("Initial array:", list);

// CREATE: Add an item
list.push("Item 4");
console.log("After CREATE (added Item 4):", list);

// READ: Display all items
console.log("READ - All items:", list);

// UPDATE: Change second item (index 1)
list[1] = "Item 2 (updated)";
console.log("After UPDATE (changed Item 2):", list);

// DELETE: Remove the third item (index 2)
list.splice(2, 1);
console.log("After DELETE (removed index 2):", list);

console.log("Final array:", list);

