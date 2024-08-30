import Error "mo:base/Error";

import Float "mo:base/Float";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async ?Float {
    switch (operation) {
      case ("+") { ?(num1 + num2) };
      case ("-") { ?(num1 - num2) };
      case ("*") { ?(num1 * num2) };
      case ("/") {
        if (num2 == 0) {
          Debug.print("Error: Division by zero");
          null
        } else {
          ?(num1 / num2)
        }
      };
      case (_) {
        Debug.print("Error: Invalid operation");
        null
      };
    }
  };
}
