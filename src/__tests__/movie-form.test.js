import React from "react";
import { render, fireEvent, getByRole, wait, screen } from "@testing-library/react";
import MovieForm from "../components/movie-form";
global.fetch = require("jest-fetch-mock");
const movie = {
  id: 12,
  title: "The Shawshank Redemption",
  description: "Two imprisoned",
};
const empty_movie = {
  title: "",
  description: "",
};
describe("Movie form Test Suite  ", () => {
  test("Movie Form Should match Snapshot ", () => {
    const { container, getByLabelText, getByRole } = render(
      <MovieForm movie={empty_movie} />
    );
    expect(container).toMatchSnapshot();
    expect(getByLabelText(/description/i)).toBeTruthy();
    expect(getByLabelText(/title/i)).toBeTruthy();
    expect(getByRole("button", { name: /create/i })).toBeTruthy();
  });
  test("Movie edit movie ", () => {
    const { getByLabelText, getByRole } = render(<MovieForm movie={movie} />);
    expect(getByLabelText(/description/i).value).toBe(movie.description);
    expect(getByLabelText(/title/i).value).toBe(movie.title);
    expect(getByRole("button", { name: /update/i })).toBeTruthy();
  });
  test("Should trigger Api call on button click  ", async () => {
    const updatedMovie = jest.fn();
    const { getByLabelText, getByRole } = render(
      <MovieForm movie={movie} udpatedMovie={updatedMovie} />
    );
    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(movie),
      })
    );

    const submitButton = getByRole("button", { name: /update/i });
    fireEvent.click(submitButton);
    await wait(() => {
      expect(updatedMovie).toBeCalledTimes(1);
    });
  });

  test("Should not trigger Api call on button click  in empty form", async () => {
    const updatedMovie = jest.fn();
    const { getByLabelText, getByRole } = render(
      <MovieForm movie={empty_movie} udpatedMovie={updatedMovie} />
    );
    fetch.mockImplementationOnce(JSON.stringify(empty_movie));
    const submitButton = getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);
    await wait(() => {
      expect(updatedMovie).toBeCalledTimes(0);
    });
  });


  test("Should not trigger Api call when clicked on new movie button ", async () => {
    const movieCreated = jest.fn();
   // fetch.mockResponseOnce(JSON.stringify(movie));
    fetch.mockResponseOnce(JSON.stringify(movie));
    
    const { getByRole } = render(
      <MovieForm movie={empty_movie} movieCreated={movieCreated} />
    );
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(titleInput, { target: { value: "The Shawshank Redemption" } });
      fireEvent.change(descriptionInput, { target: { value: "Two imprisoned" } });

    const submitButton = getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);
    await wait(() => {
      console.log(movieCreated.mock.calls);
      //expect(movieCreated.mock.calls[0][0]).toBe(movie);
      expect(movieCreated).toBeCalledWith(movie);
    });
  });
});
