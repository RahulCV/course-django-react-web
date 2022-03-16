import React from "react";
import { render, fireEvent, getByRole, wait } from "@testing-library/react";
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
});
