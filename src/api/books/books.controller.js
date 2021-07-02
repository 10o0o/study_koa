const Book = require('models/book');
const { isValidObjectId } = require('mongoose');

exports.get = async (ctx) => {
  const { id } = ctx.params;

  let book;

  try {
    book = await Book.findById(id).exec();
  } catch (e) {
    if (e.name === 'CastError') {
      ctx.status = 400;
      ctx.body = {
        message: '잘못된 id값입니다.',
        data: null
      }
      return;
    }
    return ctx.throw(500, e);
  }

  if (!book) {
    ctx.status = 404;
    ctx.body = { message: 'book is not found' };
    return;
  }

  ctx.body = book;
}

exports.list = async (ctx) => {
  let books, count, isDesc;

  if (ctx.query) {
    count = ctx.query.count;
    isDesc = ctx.query.isDesc;
  }

  try {
    if (count && isDesc === 'Desc') {
      console.log('first');
      books = await Book.find().exec()
      .sort({ _id: -1 })
      .limit(Number(count))
      .exec();
    } else if (count) {
      console.log('second');
      books = await Book.find().exec()
      .limit(Number(count))
      .exec();
    } else if (isDesc === 'Desc') {
      console.log('third');
      books = await Book.find().exec()
      .sort({ _id: -1 })
      .exec();
    } else {
      console.log('fourth');
      books = await Book.find().exec();
    }
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = books;
};

exports.create = async (ctx) => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body;

  const book = new Book({ title, authors, publishedDate, price, tags });

  try {
    await book.save().exeC();
  } catch(e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;
  let book;

  try {
    book = await Book.findByIdAndRemove(id).exec();
  } catch(e) {
    if (e.name === 'CastError') {
      console.log('cast error occur')
      ctx.status = 400;
      ctx.body = {
        message: '유효하지 않는 ID',
        data: null,
      }
      return
    }
  }

  if (!book) {
    ctx.status = 404;
    ctx.body = {
      message: '이미 삭제되었거나 없는 책입니다.',
      data: null,
    }
    return;
  }

  // ctx.status = 204; // No Content
  ctx.body = {
    message: 'SuccessFully Deleted',
    data: book
  }
};

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true,
      new: true
    })
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = {
    message: 'SuccessFully updated!',
    data: book
  };
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  if (!isValidObjectId(id)) {
    ctx.status = 400;
    ctx.body = {
      message: '유효하지 않은 ID',
      data: null
    };
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = {
    message: 'Successfully modified!',
    data: book
  };
};