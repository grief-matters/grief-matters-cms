// actions.js

export function HelloWorldAction(props: any) {
  return {
    label: "Hello world",
    onHandle: () => {
      // Here you can perform your actions
      window.alert("👋 Hello from custom action");
    },
  };
}
