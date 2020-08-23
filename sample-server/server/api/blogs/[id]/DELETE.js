export const precheck = [
  isLoggedIn,
  param('id').isNumber(),
]

export const handler = async (context) => {
  const { request: { params: { id } }, database } = context;

  await database.blogs.deleteOne({_id: id});

  return [200];
}

export const postcheck = (context) => {
  if(context.error){
    return [500];
  }
}
