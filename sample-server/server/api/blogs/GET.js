export const handler = (context) => {
  const { database } = context;

  const blogs = await database.blogs.find({});

  return blogs;
}

export const postcheck = (context) => {
  const { response, error } = context;

  if (error) {
    return [500]
  }

  if (response.length > 0) {
    return [200, response.body];
  }

  if (response.length === 0) {
    return [404];
  }
}

const statusCodes = {
  200: Blogs,
  404: [],
  503: ErrorMessage,
}