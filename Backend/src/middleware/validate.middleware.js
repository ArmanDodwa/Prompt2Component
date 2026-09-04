export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace req properties with validated, sanitized values
    req.body = parsed.body;
    next();
  } catch (error) {
    return res.status(400).json({ 
      status: 'fail', 
      errors: error.errors.map(err => ({ field: err.path[1], message: err.message })) 
    });
  }
};