export const testController = (req, res) => {
  res.status(200).send({
    message: "Test controller is working",
    success: true,
  });
};
