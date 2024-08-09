import Option "mo:base/Option";
import Trie "mo:base/Trie";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";

actor EatSecureDao {
    public query (message) func greet() : async Principal {
    message.caller
  };

  /**
   * Types for User
   */
  public type Result<T, E> = Result.Result<T, E>;

  public type User = {
    name: Text;
    avatar: Text;
  };

  /**
   * Application State for User
   */
  private stable var users: Trie.Trie<Principal, User> = Trie.empty();

  /**
   * High-Level API for User
   */
  // Register a User
  public  shared (msg)func  signUpWithInternetIdentity() : async Bool {

    let result=Trie.find(users, userKey(msg.caller), Principal.equal);
    let exists = Option.isSome(result);

    // Control whether the user exists
    if (exists) {
      return false; // User is already registered
    };

    // Create new User
    let newUser = { name = ""; avatar = "" };
    users := Trie.replace(users, userKey(msg.caller), Principal.equal, ?newUser).0;
    
    return true; // New user created!
  };

  // Update a User
  public shared func updateUser(user: User, caller: Principal): async Bool {
    let result = Trie.find(users, userKey(caller), Principal.equal);
    let exists = Option.isSome(result);
    if (exists) {
      users := Trie.replace(users, userKey(caller), Principal.equal, ?user).0;
    };
    return exists;
  };

  // Delete a User
  public shared func deleteUser(caller: Principal): async Bool {
    let result = Trie.find(users, userKey(caller), Principal.equal);
    let exists = Option.isSome(result);
    if (exists) {
      users := Trie.replace(users, userKey(caller), Principal.equal, null).0;
    };
    return exists;
  };

  // Get the current user based on the caller's principal
  public query func getCurrentUser(caller: Principal): async ?User {
    let result = Trie.find(users, userKey(caller), Principal.equal);
    return result;
  };

  // Get All Users
  public query func listUsers(): async [(Principal, User)] {
    return Trie.toArray<Principal, User, (Principal, User)>(
      users,
      func (k, v): (Principal, User) {
        (k, v)
      }
    );
  };

  /**
   * Types for Product
   */
  public type ProductId = Nat32;

  public type Product = {
    name: Text;
    production_date: Text;
    expiration_date: Text;
    image: Text;
    owner: Principal;
  };

  public type ResponseProduct = {
    id: Nat32;
    name: Text;
    production_date: Text;
    expiration_date: Text;
    image: Text;
    owner: Principal;
  };

  /**
   * Application State for Product
   */
  private stable var next: ProductId = 0;
  private stable var products: Trie.Trie<ProductId, Product> = Trie.empty();

  /**
   * High-Level API for Products
   */
  // Create a product
  public shared func createProduct(product: Product): async Bool {
    let productId = next;
    next += 1;

    products := Trie.replace(products, key(productId), Nat32.equal, ?product).0;

    return true;
  };

  // Get current user products
  public query func getUserProducts(caller: Principal): async [ResponseProduct] {
    let filteredProducts = Trie.filter<ProductId, Product>(products, func (key: ProductId, product: Product) {
      product.owner == caller
    });

    return Trie.toArray<ProductId, Product, ResponseProduct>(
      filteredProducts,
      func (k, v): ResponseProduct {
        { id = k; name = v.name; production_date = v.production_date; expiration_date = v.expiration_date; image = v.image; owner = v.owner }
      }
    );
  };

  // Read a product
  public query func readProduct(productId: ProductId): async ?Product {
    let result = Trie.find(products, key(productId), Nat32.equal);
    return result;
  };

  // Update a product
  public shared func updateProduct(productId: ProductId, product: Product): async Bool {
    let result = Trie.find(products, key(productId), Nat32.equal);
    let exists = Option.isSome(result);
    if (exists) {
      products := Trie.replace(products, key(productId), Nat32.equal, ?product).0;
    };
    return exists;
  };

  // Delete a product
  public shared func deleteProduct(productId: ProductId): async Bool {
    let result = Trie.find(products, key(productId), Nat32.equal);
    let exists = Option.isSome(result);
    if (exists) {
      products := Trie.replace(products, key(productId), Nat32.equal, null).0;
    };
    return exists;
  };

  // List all products
  public query func listProducts(): async [ResponseProduct] {
    return Trie.toArray<ProductId, Product, ResponseProduct>(
      products,
      func (k, v): ResponseProduct {
        { id = k; name = v.name; production_date = v.production_date; expiration_date = v.expiration_date; image = v.image; owner = v.owner }
      }
    );
  };

  /**
   * Utilities
   */
  private func key(x: ProductId): Trie.Key<ProductId> {
    return { hash = x; key = x };
  };

  private func userKey(x: Principal): Trie.Key<Principal> {
    return { hash = Principal.hash x; key = x };
  };
};
