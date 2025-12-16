"""
serial_plot.py
Simple Python utility to read CSV-like serial lines (temperature,humidity), plot in real-time and save to CSV.
Usage: python serial_plot.py --port COM3 --baud 9600 --out data.csv
Requires: pyserial, matplotlib
pip install pyserial matplotlib
"""
import argparse
import csv
import sys
import time

import serial
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--port', required=True, help='Serial port (e.g., COM3 or /dev/ttyUSB0)')
    p.add_argument('--baud', type=int, default=9600)
    p.add_argument('--out', default='iot_data.csv', help='CSV output filename')
    return p.parse_args()


def main():
    args = parse_args()
    try:
        ser = serial.Serial(args.port, args.baud, timeout=1)
    except Exception as e:
        print('Error opening serial port:', e)
        sys.exit(1)

    csvfile = open(args.out, 'w', newline='')
    writer = csv.writer(csvfile)
    writer.writerow(['timestamp', 'temperature', 'humidity'])

    fig, ax = plt.subplots()
    xs, temps, hums = [], [], []

    def read_line():
        try:
            line = ser.readline().decode(errors='ignore').strip()
            if not line:
                return None
            parts = [p.strip() for p in line.split(',')]
            if len(parts) >= 2:
                t = float(parts[0]); h = float(parts[1])
                return (time.time(), t, h)
        except Exception:
            return None

    def update(frame):
        row = read_line()
        if row:
            ts, t, h = row
            writer.writerow([ts, t, h]); csvfile.flush()
            xs.append(ts - xs[0] if xs else 0)
            temps.append(t); hums.append(h)
            if len(temps) > 200:
                xs.pop(0); temps.pop(0); hums.pop(0)
            ax.clear()
            ax.plot(xs, temps, label='Temp (°C)')
            ax.plot(xs, hums, label='Humidity (%)')
            ax.legend(loc='upper right')
            ax.set_ylim(0, 100)
            ax.set_xlabel('Seconds')

    ani = FuncAnimation(fig, update, interval=500)
    plt.show()


if __name__ == '__main__':
    main()
