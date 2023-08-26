export const realTimeProducts = async (req, res) => {
  try {
    return res.render("realTimeProducts", {});
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
      data: {},
    });
  }
};
