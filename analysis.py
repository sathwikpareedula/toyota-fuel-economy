import pandas as pd

def load_data(filename):
    try:
        data = pd.read_csv(filename)
        return data
    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
        return None

def main():
    filename = 'data/vehicle_data.csv'  # Path to the CSV file
    data = load_data(filename)
    
    if data is not None:
        # Filter data for the years 2021 to 2025
        filtered_data = data[(data['Year'] >= 2021) & (data['Year'] <= 2025)]
        
        # Perform further analysis on filtered_data
        avg_city_mpg, avg_highway_mpg, avg_combined_mpg = calculate_average_mpg(filtered_data)
        print(f"Average City MPG: {avg_city_mpg:.2f}")
        print(f"Average Highway MPG: {avg_highway_mpg:.2f}")
        print(f"Average Combined MPG: {avg_combined_mpg:.2f}")
        
        plot_mpg_distribution(filtered_data)
        plot_mpg_by_model(filtered_data)

if __name__ == "__main__":
    main()