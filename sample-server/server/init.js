export const port = 8080;

export const onStartup = (context) => {
  console.log(`Server now listening at port ${port}`);

  context.database = {
    // database client
  };

  return context;
}

export const onShutdown = (context) => {
  console.log(`Server closing down...`);
}