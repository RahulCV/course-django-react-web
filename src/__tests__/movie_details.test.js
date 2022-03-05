import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MovieDetails from "../components/movie-details";
const selectedMovie = {
  id: 1,
  title: "The Shawshank Redemption",
  description: "Two imprisoned",
  avg_rating: 4,
  no_of_ratings: "10",
};
describe("SnapShot Test ", () => {
  test("movieDtails Should match Snapshot ", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    expect(container).toMatchSnapshot();
  });

  test("Should display title and description", () => {
    const { queryByText } = render(<MovieDetails movie={selectedMovie} />);
    expect(queryByText(selectedMovie.title)).toBeTruthy();
    expect(queryByText(selectedMovie.description)).toBeTruthy();
  });
  test("rating", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const selected_stars = container.querySelectorAll(".orange");
    expect(selected_stars.length).toBe(selectedMovie.avg_rating);
  });
  test("no of Rating", () => {
    const { getByTestId } = render(<MovieDetails movie={selectedMovie} />);

    expect(getByTestId("rating").innerHTML).toBe(selectedMovie.no_of_ratings);
  });

  test("Mouse over should highlight stars", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const stars = container.querySelectorAll(".rate-container svg");
    stars.forEach((start, index) => {
      fireEvent.mouseOver(start);
      const highlighted_stars = container.querySelectorAll(".purple");
      expect(highlighted_stars.length).toBe(index + 1);
    });
  });

  test("Mouse leave  should un highlight stars", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const stars = container.querySelectorAll(".rate-container svg");
    stars.forEach((start, index) => {
      fireEvent.mouseOver(start);
      fireEvent.mouseOut(start);
      const highlighted_stars = container.querySelectorAll(".purple");
      expect(highlighted_stars.length).toBe(0);
    });
  });

  test("Click on star should update rating", () => {
    const loadMovie = jest.fn();
    const { container } = render(
      <MovieDetails movie={selectedMovie} loadMovie={loadMovie} />
    );
    const stars = container.querySelectorAll(".rate-container svg");
    stars.forEach((start, index) => {
      fireEvent.click(start);
    });

    setTimeout(() => {
      expect(loadMovie).toHaveBeenCalledTimes(stars.length);
    }, 0);
  });
});
